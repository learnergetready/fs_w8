import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { alphabetically, byAuthorbyYear } from "../utils"
import { useState } from "react"

const Books = () => {
    const [bookFilter, setBookFilter] = useState("all genres")
    const result = useQuery(ALL_BOOKS)
    const withBookFilter = (b) =>
        bookFilter === "all genres" ? true : b.genres.includes(bookFilter)

    if (result.loading) return <div>loading... </div>
    const allGenres = result.data.allBooks
        .reduce((acc, curr) => {
            curr.genres.map((g) => (acc.includes(g) ? null : acc.push(g)))
            return acc
        }, [])
        .toSorted(alphabetically)
    return (
        <div>
            <h2>books</h2>

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                    </tr>
                    {result.data.allBooks
                        .filter(withBookFilter)
                        .toSorted(byAuthorbyYear)
                        .map((a) => (
                            <tr key={a.title}>
                                <td>{a.title}</td>
                                <td>{a.author.name}</td>
                                <td>{a.published}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {allGenres.map((g) => (
                <button key={g} onClick={() => setBookFilter(g)}>
                    {g}
                </button>
            ))}
            <button
                key="all genres"
                onClick={() => setBookFilter("all genres")}
            >
                all genres
            </button>
        </div>
    )
}

export default Books
