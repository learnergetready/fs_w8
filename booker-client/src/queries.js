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
    query {
        allBooks {
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

export const ADD_BOOK = gql`
    mutation AddBook(
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
            author
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
