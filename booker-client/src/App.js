import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import { Routes, Route, useNavigate } from "react-router-dom"

const App = () => {
    const navigate = useNavigate()

    return (
        <div>
            <div>
                <button onClick={() => navigate("/authors")}>authors</button>
                <button onClick={() => navigate("/books")}>books</button>
                <button onClick={() => navigate("/add")}>add book</button>
            </div>
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
            </Routes>
        </div>
    )
}

export default App
