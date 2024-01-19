import Authors from "./components/Authors"
import Books from "./components/Books"
import LoginForm from "./components/LoginForm"
import NewBook from "./components/NewBook"
import { Routes, Route, useNavigate } from "react-router-dom"
import { useState } from "react"
import { useApolloClient } from "@apollo/client"

const App = () => {
    const navigate = useNavigate()
    const [token, setToken] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const client = useApolloClient()

    const notifyHere = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 6000)
    }

    const logout = () => {
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
                    <button onClick={() => navigate("/add")}>add book</button>
                )}
                {!token && (
                    <button onClick={() => navigate("/login")}>login</button>
                )}
                {token && <button onClick={logout}>log out</button>}
            </div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
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
