module.exports = request => {
    return new Promise((resolve) => {
        request.then(resp => {
            resolve(resp.data)
        })
    })
}
