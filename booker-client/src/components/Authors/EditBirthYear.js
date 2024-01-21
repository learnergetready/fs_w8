import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../../queries"
import { byAuthor } from "../../utils"

const EditBirthYear = () => {
    const [errorMessage, setErrorMessage] = useState(null)
    const notifyHere = (message) => {
        setErrorMessage(message)
        setTimeout(() => {
            setErrorMessage(null)
        }, 6000)
    }
    const resultofAuthorQuery = useQuery(ALL_AUTHORS)
    const [editBirthYear, result] = useMutation(EDIT_BIRTHYEAR, {
        refetchQueries: [{ query: ALL_AUTHORS }],
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
    useEffect(() => {
        if (result.data && result.data.editAuthor === null) {
            notifyHere("The author you tried to edit was not found.")
        }
    }, [result.data])

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
