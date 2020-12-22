
export const getData = () => fetch("http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1")
    .then(response => response.json())

export const getPlaceData = (ids) => fetch("http://exam-2020-1-api.std-900.ist.mospolytech.ru/api/data1/" + ids )
    .then(response => response.json())
