export const getAllLocalities = () => {
    return fetch('http://localhost:8080/api/fields/locations').then((locationsResponse) => {
        return locationsResponse;
    })
}