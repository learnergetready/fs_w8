import { useQuery } from "@apollo/client"
import { ALL_BOOKS, ALL_GENRES } from "../queries"
import { byAuthorbyYear } from "../utils"

const Books = () => {
    const { loading, data, refetch } = useQuery(ALL_BOOKS)
    const allGenres = useQuery(ALL_GENRES)

    if (loading || allGenres.loading) return <div>loading... </div>

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
                    {data.allBooks.toSorted(byAuthorbyYear).map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author.name}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {allGenres.data.allGenres.map((g) => (
                <button key={g} onClick={() => refetch({ genre: g })}>
                    {g}
                </button>
            ))}
            <button key="all genres" onClick={() => refetch({ genre: null })}>
                all genres
            </button>
        </div>
    )
}

export default Books
