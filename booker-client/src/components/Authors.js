import { useMutation, useQuery } from "@apollo/client"
import { ALL_AUTHORS, EDIT_BIRTHYEAR } from "../queries"
import { authorsAlphabetically } from "../utils"
import { useEffect, useState } from "react"

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
          {result.data.allAuthors.toSorted(authorsAlphabetically).map((a) => (
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

const EditBirthYear = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const notifyHere = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 6000);
  }
  const [editBirthYear, result] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{query: ALL_AUTHORS}]
  })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const {name, born} = event.target
    await editBirthYear({variables: {name: name.value, setBornTo: parseInt(born.value)}})
    name.value = ""
    born.value = ""
  }
  useEffect(() => {
    if (result.data && result.data.editAuthor === null) {
      notifyHere("The author you tried to edit was not found.")
    }
  },[result.data])
  return (
    <div>
    <h2>Set birthyear</h2>
    {errorMessage && <div style={{color:"red"}}>{errorMessage}</div>}
    <form onSubmit={handleSubmit}>
      <div>
        name
        <input name="name" />
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

export default Authors
