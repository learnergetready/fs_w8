import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../../queries"
import { byAuthor } from "../../utils"
import EditBirthYear from "./EditBirthYear"

const Authors = () => {
    const result = useQuery(ALL_AUTHORS)

    if (result.loading) return <div>loading... </div>

    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>born</th>
                        <th>books</th>
                    </tr>
                    {result.data.allAuthors.toSorted(byAuthor).map((a) => (
                        <tr key={a.name}>
                            <td>{a.name}</td>
                            <td>{a.born}</td>
                            <td>{a.bookCount}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <EditBirthYear />
        </div>
    )
}

export default Authors
