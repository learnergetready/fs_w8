import { useQuery } from "@apollo/client"
import { ALL_BOOKS } from "../queries"
import { byAuthorbyYear } from "../utils"

const Books = () => {
    const result = useQuery(ALL_BOOKS)

    if (result.loading) return <div>loading... </div>

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
                    {result.data.allBooks.toSorted(byAuthorbyYear).map((a) => (
                        <tr key={a.title}>
                            <td>{a.title}</td>
                            <td>{a.author}</td>
                            <td>{a.published}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Books
