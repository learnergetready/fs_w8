import Authors from "./components/Authors"
import Books from "./components/Books"
import LoginForm from "./components/LoginForm"
import NewBook from "./components/NewBook"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useApolloClient, useSubscription } from "@apollo/client"
import Recommend from "./components/Recommend"
import { ALL_BOOKS, ALL_GENRES, BOOK_ADDED } from "./queries"
import { alphabetically } from "./utils"

const App = () => {
    const navigate = useNavigate()
    const [token, setToken] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [errorColor, setErrorColor] = useState(null)
    const client = useApolloClient()

    const notifyHere = (message, color = "red") => {
        setErrorMessage(message)
        setErrorColor(color)
        setTimeout(() => {
            setErrorMessage(null)
            setErrorColor(null)
        }, 6000)
    }

    useSubscription(BOOK_ADDED, {
        onData: ({ data }) => {
            const addedBook = data.data.bookAdded
            notifyHere(
                `A new book added: ${addedBook.title} by ${addedBook.author.name}`,
                "green",
            )
            client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
                return {
                    allBooks: allBooks.concat(addedBook),
                }
            })
            client.cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
                const newGenres = addedBook.genres.reduce(
                    (acc, curr) =>
                        allGenres.includes(curr) ? acc : acc.concat(curr),
                    [],
                )
                return {
                    allGenres: allGenres
                        .concat(newGenres)
                        .toSorted(alphabetically),
                }
            })
        },
    })

    const logout = () => {
        navigate("/")
        setToken(null)
        localStorage.clear()
        client.resetStore()
    }

    return (
        <div>
            <div>
                <button onClick={() => navigate("/authors")}>authors</button>
                <button onClick={() => navigate("/books")}>books</button>
                {token && (
                    <>
                        <button onClick={() => navigate("/add")}>
                            add book
                        </button>
                        <button onClick={() => navigate("/recommend")}>
                            recommend
                        </button>
                        <button onClick={logout}>log out</button>
                    </>
                )}
                {!token && (
                    <button onClick={() => navigate("/login")}>login</button>
                )}
            </div>
            {errorMessage && (
                <div style={{ color: errorColor }}>{errorMessage}</div>
            )}
            <Routes>
                <Route
                    path="/"
                    element={
                        <div>
                            <br />
                            Welcome to the site, click the buttons to navigate
                        </div>
                    }
                />
                <Route path="/authors" element={<Authors />} />
                <Route path="/books" element={<Books />} />
                <Route path="/add" element={<NewBook />} />
                <Route path="/recommend" element={<Recommend />} />
                <Route
                    path="/login"
                    element={
                        <LoginForm setError={notifyHere} setToken={setToken} />
                    }
                />
            </Routes>
        </div>
    )
}

export default App
