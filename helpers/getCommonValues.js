export const getCommonValues = (arr1, arr2) => {
    const commonValues = []
    arr1.forEach((item) => {
        if (arr2.includes(item)) {
            commonValues.push(item)
        }
    })
    return commonValues
}
