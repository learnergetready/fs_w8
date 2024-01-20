import { useQuery } from "@apollo/client"
import { ALL_BOOKS_WITH_FILTERS, ME } from "../queries"
import { byAuthorbyYear } from "../utils"

const Recommend = () => {
    const fetchedUser = useQuery(ME)
    const { data, loading } = useQuery(ALL_BOOKS_WITH_FILTERS, {
        skip: !fetchedUser.data,
        variables: { genre: fetchedUser.data?.me.favoriteGenre },
    })

    if (fetchedUser.loading) return <div>loading... </div>

    if (loading) return <div>loading... </div>

    return (
        <div>
            <h2>recommendations</h2>
            <p>
                books in your favorite genre:{" "}
                <strong>{fetchedUser.data.me.favoriteGenre}</strong>
            </p>
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
        </div>
    )
}

export default Recommend
