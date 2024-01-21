import { useState } from "react"
import { useApolloClient, useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../../queries"
import { byAuthor } from "../../utils"

const EditBirthYear = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const client = useApolloClient()
    const notifyHere = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 6000)
    }
    const resultofAuthorQuery = useQuery(ALL_AUTHORS)
    const [editBirthYear] = useMutation(EDIT_BIRTHYEAR, {
        onCompleted: ({ editAuthor }) => {
            client.cache.updateQuery(
                { query: ALL_AUTHORS },
                ({ allAuthors }) => {
                    return {
                        allAuthors: allAuthors.map((a) =>
                            a.id === editAuthor.id ? editAuthor : a,
                        ),
                    }
                },
            )
        },
        onError: (error) => {
            const messages = error.graphQLErrors
                .map((e) => e.message)
                .join("\n")
            notifyHere(messages)
        },
    })
    const handleSubmit = async (event) => {
        event.preventDefault()
        const { name, born } = event.target
        try {
            await editBirthYear({
                variables: {
                    name: name.value,
                    setBornTo: parseInt(born.value),
                },
            })
        } catch (error) {
            notifyHere(error.message)
        }
        name.value = ""
        born.value = ""
    }

    if (resultofAuthorQuery.loading) {
        return <div>loading authors...</div>
    }

    return (
        <div>
            <h2>Set birthyear</h2>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    name
                    <select name="name">
                        {resultofAuthorQuery.data.allAuthors
                            .toSorted(byAuthor)
                            .map((a) => (
                                <option key={a.id} value={a.name}>
                                    {a.name}
                                </option>
                            ))}
                    </select>
                </div>
                <div>
                    born
                    <input type="number" name="born" />
                </div>
                <button type="submit">update author</button>
            </form>
        </div>
    )
}

export default EditBirthYear
