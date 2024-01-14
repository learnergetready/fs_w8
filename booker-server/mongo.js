const mongoose = require("mongoose")
const Author = require("./models/author")
const Book = require("./models/book")

let initialAuthors = [
    {
        name: "Robert Martin",
        born: 1952,
    },
    {
        name: "Martin Fowler",
        born: 1963,
    },
    {
        name: "Fyodor Dostoevsky",
        born: 1821,
    },
    {
        name: "Joshua Kerievsky", // birthyear not known
    },
    {
        name: "Sandi Metz", // birthyear not known
    },
]

let initialBooks = [
    {
        title: "Clean Code",
        published: 2008,
        author: "Robert Martin",
        genres: ["refactoring"],
    },
    {
        title: "Agile software development",
        published: 2002,
        author: "Robert Martin",
        genres: ["agile", "patterns", "design"],
    },
    {
        title: "Refactoring, edition 2",
        published: 2018,
        author: "Martin Fowler",
        genres: ["refactoring"],
    },
    {
        title: "Refactoring to patterns",
        published: 2008,
        author: "Joshua Kerievsky",
        genres: ["refactoring", "patterns"],
    },
    {
        title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        published: 2012,
        author: "Sandi Metz",
        genres: ["refactoring", "design"],
    },
    {
        title: "Crime and punishment",
        published: 1866,
        author: "Fyodor Dostoevsky",
        genres: ["classic", "crime"],
    },
    {
        title: "The Demon ",
        published: 1872,
        author: "Fyodor Dostoevsky",
        genres: ["classic", "revolution"],
    },
]

const initializeAuthors = async () => {
    await Author.deleteMany({})
    const authorObjects = initialAuthors.map((author) => new Author(author))
    const promiseArray = authorObjects.map((authorObject) =>
        authorObject.save(),
    )
    await Promise.all(promiseArray)
}

const getBooksWithAuthorIds = async () => {
    let newArray = []
    const booksWithAuthorIds = initialBooks.map(async (book) => {
        const authorWhoWrote = await Author.findOne({ name: book.author })
        newArray.push({ ...book, author: authorWhoWrote._id })
    })
    await Promise.all(booksWithAuthorIds)
    return newArray
}

const initializeBooks = async (booksWithAuthorIds) => {
    await Book.deleteMany({})
    const bookObjects = booksWithAuthorIds.map((book) => new Book(book))
    const promiseArray = bookObjects.map(async (bookObject) =>
        bookObject.save(),
    )
    await Promise.all(promiseArray)
}

if (process.argv.length < 3) {
    console.log("give password as argument")
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fox-person-himmel:${password}@cluster0.gekqkha.mongodb.net/booker?retryWrites=true&w=majority`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const initialization = async () => {
    await initializeAuthors()
    const booksWithAuthorIds = await getBooksWithAuthorIds()
    await initializeBooks(booksWithAuthorIds)
    mongoose.connection.close()
}
initialization()
