export const authorsAlphabetically /* byLastName */ = (a, b) => {
    const lastName = (names) => names.split(" ").at(-1)
    const lastA = lastName(a.name)
    const lastB = lastName(b.name)
    
    if (lastA < lastB) {
        return -1
    } else if (lastA > lastB) {
        return 1
    }
    return 0
}