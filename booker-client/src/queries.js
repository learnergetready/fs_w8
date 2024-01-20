import { gql } from "@apollo/client"

const AUTHOR_DETAILS = gql`
    fragment AuthorDetails on Author {
        name
        id
        born
        bookCount
    }
`

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            ...AuthorDetails
        }
    }
    ${AUTHOR_DETAILS}
`

const BOOK_DETAILS = gql`
    fragment BookDetails on Book {
        title
        published
        id
        author {
            ...AuthorDetails
        }
        genres
    }
    ${AUTHOR_DETAILS}
`

export const ALL_BOOKS = gql`
    query AllBooks($author: String, $genre: String) {
        allBooks(author: $author, genre: $genre) {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const ALL_GENRES = gql`
    query {
        allGenres
    }
`

export const ME = gql`
    query {
        me {
            username
            favoriteGenre
            id
        }
    }
`

export const ADD_BOOK = gql`
    mutation addBook(
        $title: String!
        $published: Int!
        $author: String!
        $genres: [String!]!
    ) {
        addBook(
            title: $title
            published: $published
            author: $author
            genres: $genres
        ) {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const EDIT_BIRTHYEAR = gql`
    mutation editBirthYear($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            ...AuthorDetails
        }
    }
    ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`

export const BOOK_ADDED = gql`
    subscription {
        bookAdded {
            ...BookDetails
        }
    }
    ${BOOK_DETAILS}
`

export const GENRE_ADDED = gql`
    subscription {
        genreAdded
    }
`
