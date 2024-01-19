export const alphabetically = (a, b) => {
    if (a < b) {
        return -1
    } else if (a > b) {
        return 1
    }
    return 0
}

const compareByLastName = (nameA, nameB) => {
    const lastName = (names) => names.split(" ").at(-1)
    const lastA = lastName(nameA)
    const lastB = lastName(nameB)
    return alphabetically(lastA, lastB)
}
//author-table
export const byAuthor = (a, b) => compareByLastName(a.name, b.name)

//books-table
export const byAuthorbyYear = (a, b) => {
    const authorResult = compareByLastName(a.author.name, b.author.name)
    if (authorResult === 0) return byYearPublished(a, b)
    return authorResult
}

const byYearPublished = (a, b) => {
    if (a.published < b.published) {
        return -1
    } else if (a.published > b.published) {
        return 1
    }
    return 0
}
