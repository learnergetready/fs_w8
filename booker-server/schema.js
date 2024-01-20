const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  
  type Token {
    value: String!
  }

  type Author {
    name: String!,
    born: Int,
    id: ID!,
    bookCount: Int!
  }

  type Book {
    title: String!,
    published: Int!,
    author: Author!,
    genres: [String!]!
    id: ID!
  }

  type Subscription {
    bookAdded: Book!,
    genreAdded: String!
  }

  type Query {
    bookCount: Int!,
    authorCount: Int!,
    allBooks(author: String, genre: String): [Book!]!,
    allAuthors: [Author!]!,
    me: User,
    allGenres: [String!]!
  }

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
    ): Author,
    createUser(
        username: String!
        favoriteGenre: String!
        password: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }
`

module.exports = typeDefs
