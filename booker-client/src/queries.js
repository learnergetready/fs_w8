import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
    query {
        allAuthors {
            name
            id
            born
            bookCount
        }
    }
`

export const ALL_BOOKS = gql`
    query AllBooks($author: String, $genre: String) {
        allBooks(author: $author, genre: $genre) {
            title
            published
            id
            author {
                name
                born
                id
                bookCount
            }
            genres
        }
    }
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
            title
            published
            author {
                name
                born
                id
                bookCount
            }
            id
            genres
        }
    }
`

export const EDIT_BIRTHYEAR = gql`
    mutation editBirthYear($name: String!, $setBornTo: Int!) {
        editAuthor(name: $name, setBornTo: $setBornTo) {
            name
            id
            born
            bookCount
        }
    }
`

export const LOGIN = gql`
    mutation login($username: String!, $password: String!) {
        login(username: $username, password: $password) {
            value
        }
    }
`
