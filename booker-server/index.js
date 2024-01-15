require("dotenv").config()
const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const mongoose = require("mongoose")
const Author = require("./models/author")
const Book = require("./models/book")
const { GraphQLError } = require("graphql")

mongoose.set("strictQuery", false)

console.log("connecting to:", process.env.MONGODB_URI)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("connected to MongoDB"))
    .catch((error) =>
        console.log("error in connecting to MongoDB:", error.message),
    )

const typeDefs = `
  type Author {
    name: String!,
    born: Int,
    id: ID!,
    bookCount: Int!
  },
  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    genres: [String!]!
    id: ID!
  },

  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book!]!,
    allAuthors: [Author!]!,
  },

  type Mutation {
    addBook(
      title: String!,
      published: Int!,
      author: String!,
      genres: [String!]!
    ) : Book,
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
  }
`

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
    },
    Author: {
        bookCount: async (root) => {
            const authorWhoWrote = await Author.findOne({ name: root.name })
            const booksCount = await Book.find({
                author: authorWhoWrote._id,
            }).countDocuments()
            return booksCount
        },
    },
    Book: {
        author: async (root) => Author.findById(root.author),
    },
    Mutation: {
        addBook: async (root, args) => {
            try {
                const foundAuthor = await Author.findOne({ name: args.author })
                if (!foundAuthor) {
                    const author = new Author({ name: args.author })
                    await author.save()
                    const book = new Book({ args, author })
                    await book.save()
                    return book
                }
                const book = new Book({ ...args, author: foundAuthor })
                await book.save()
                return book
            } catch (error) {
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
        },
        editAuthor: async (root, args) => {
            try {
                const foundAuthor = await Author.findOne({ name: args.name })
                if (!foundAuthor) {
                    return null
                }
                foundAuthor.born = args.setBornTo
                await foundAuthor.save()
                return foundAuthor
            } catch (error) {
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
        },
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

startStandaloneServer(server, {
    listen: { port: process.env.PORT },
}).then(({ url }) => {
    console.log(`Server ready at ${url}`)
})
