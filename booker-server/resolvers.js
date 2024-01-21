const Author = require("./models/author")
const Book = require("./models/book")
const User = require("./models/user")
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { PubSub } = require("graphql-subscriptions")

const pubsub = new PubSub()

const handleMutationError = (error) => {
    let errorMessages = ""
    if (error) {
        if (error.name === "ValidationError") {
            Object.values(error.errors).map(
                (val) => (errorMessages += val.message + " "),
            )
            throw new GraphQLError(errorMessages, {
                extensions: { code: "VALIDATION_ERROR" },
            })
        }
    }
    throw new GraphQLError("Some unhandeled error occured")
}

const resolvers = {
    Query: {
        bookCount: async () => await Book.collection.countDocuments(),
        authorCount: async () => await Author.collection.countDocuments(),
        allBooks: async (root, args) => {
            let authorWhoWrote
            if (args.author) {
                authorWhoWrote = await Author.findOne({ name: args.author })
            }
            switch (true) {
                case Boolean(args.author) && !args.genre:
                    return await Book.find({
                        author: authorWhoWrote._id,
                    }).populate("author")
                case Boolean(args.author) && Boolean(args.genre):
                    return await Book.find({
                        author: authorWhoWrote._id,
                        genres: args.genre,
                    }).populate("author")
                case !args.author && !args.genre:
                    return await Book.find({}).populate("author")
                case !args.author && Boolean(args.genre):
                    return await Book.find({
                        genres: args.genre,
                    }).populate("author")
                default:
                    return await Book.find({}).populate("author")
            }
        },
        allAuthors: async () => await Author.find({}),
        me: (root, args, context) => context.currentUser || null,
        allGenres: async () => {
            console.log("allGenres-query at ", new Date())
            return await Book.distinct("genres")
        },
    },
    Author: {
        bookCount: async (root) => {
            const authorWhoWrote = await Author.findOne({ name: root.name })
            const bookCount = await Book.find({
                author: authorWhoWrote._id,
            }).countDocuments()
            return bookCount
        },
    },
    Book: {
        author: async (root) => Author.findById(root.author),
    },
    Mutation: {
        addBook: async (root, args, context) => {
            const allGenres = await Book.distinct("genres")
            if (!context.currentUser) {
                throw new GraphQLError(
                    "Operation allowed only for logged in users",
                    { extensions: { code: "FORBIDDEN" } },
                )
            }
            try {
                const foundAuthor = await Author.findOne({ name: args.author })
                if (!foundAuthor) {
                    const author = new Author({ name: args.author })
                    await author.save()
                    const book = new Book({
                        ...args,
                        author,
                    })
                    await book.save()
                    const returnValue = book.populate("author")
                    pubsub.publish("BOOK_ADDED", { bookAdded: returnValue })
                    args.genres.forEach((g) => {
                        if (!allGenres.includes(g)) {
                            pubsub.publish("GENRE_ADDED", { genreAdded: g })
                        }
                    })
                    return returnValue
                }
                const book = new Book({
                    ...args,
                    author: foundAuthor,
                })
                await book.save()
                const returnValue = book.populate("author")
                pubsub.publish("BOOK_ADDED", { bookAdded: returnValue })
                args.genres.forEach((g) => {
                    if (!allGenres.includes(g)) {
                        pubsub.publish("GENRE_ADDED", { genreAdded: g })
                    }
                })
                return returnValue
            } catch (error) {
                handleMutationError(error)
            }
        },
        editAuthor: async (root, args, context) => {
            if (!context.currentUser) {
                throw new GraphQLError(
                    "Operation allowed only for logged in users",
                    { extensions: { code: "FORBIDDEN" } },
                )
            }
            try {
                const foundAuthor = await Author.findOne({ name: args.name })
                if (!foundAuthor) {
                    return null
                }
                foundAuthor.born = args.setBornTo
                await foundAuthor.save()
                return foundAuthor
            } catch (error) {
                handleMutationError(error)
            }
        },
        createUser: async (root, args) => {
            try {
                const { username, password, favoriteGenre } = args
                const saltRounds = 10
                const passwordHash = await bcrypt.hash(password, saltRounds)
                const user = new User({ username, favoriteGenre, passwordHash })
                const savedUser = await user.save()
                return savedUser
            } catch (error) {
                handleMutationError(error)
            }
        },
        login: async (root, args) => {
            const { username, password } = args
            const user = await User.findOne({ username })
            const passwordCorrect =
                user === null
                    ? false
                    : await bcrypt.compare(password, user.passwordHash)

            if (!user || !passwordCorrect) {
                throw new GraphQLError("Username and password did not match", {
                    extensions: { code: "BAD_USER_INPUT" },
                })
            }

            const userForToken = {
                username: user.username,
                id: user._id,
            }

            return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
        },
    },
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
        },
        genreAdded: {
            subscribe: () => pubsub.asyncIterator("GENRE_ADDED"),
        },
    },
}

module.exports = resolvers
