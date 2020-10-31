export const getAllFields = () => {

    return fetch('http://localhost:8080/api/fields').then((fieldsResponse) => {
        return fieldsResponse

    })

}