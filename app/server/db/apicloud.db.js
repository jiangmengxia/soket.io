const axios = require('axios')
const sha1 = require('sha1')

const baseUrl = 'https://www.apicloud.com/mcm/api'
const request = axios.create({
    baseURL: baseUrl,
})

const createError = (code, message) => {
    const err = new Error(message)
    err.code = code
    return err
}
const successResponse = data => {
    return {
        data: data,
        success: true
    }
}
const ErrorResponse = (code, errMsg) => {
    return {
        message: errMsg,
        code: code,
        success: false
    }
}

handleResponse = {
    reject: (rej) => {
        let {status, data} = rej.response
        // console.log(status, data.error)
        // throw createError(status, data.error.message)
        return ErrorResponse(status,data.error.message)
    },
    resolve: (res) => {
        let {status, data} = res
        // console.log(status, data)
        if (status === 200) {
            let {statusCode, message} = data
            if (statusCode) {
                throw createError(statusCode, message)
            }
            return successResponse(data)
        }
        if (!data) {
            throw createError(400, 'no data')
        }
        if (!data.success) {
            throw createError(400, data.message)
        }
    }
}

module.exports = (appId, appKey) => {
    const getHeaders = () => {
        const Now = Date.now()
        return {
            'X-APICloud-AppId': appId,
            'X-APICloud-AppKey': `${sha1(`${appId}UZ${appKey}UZ${Now}`)}.${Now}`,
        }
    }
    return {
        /*--------------------------------用户名是否已经存在-------------------------------*/
        isUserExist(className, username) {
            return new Promise((resolve, reject) => {
                let filter = JSON.stringify({
                    where: {username: username}
                })
                let url = `/${className}?filter=${filter}`
                request.get(url, {
                    headers: getHeaders(),
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        addUser(className, username) {
            /*密码默认*/
            return new Promise((resolve, reject) => {
                let url = `/${className}`
                request.post(url, {username: username, password: '111111'}, {
                    headers: getHeaders(),
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        /*登陆*/
        login(className, username) {
            return new Promise((resolve, reject) => {
                let url = `/${className}/login`
                request.post(url, {username: username, password: '111111'}, {
                    headers: getHeaders(),
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        /*退出登陆*/
        logout(className, token_id) {
            return new Promise((resolve, reject) => {
                let url = `/${className}/logout`
                let headers = getHeaders()
                headers.authorization = token_id
                // console.log(token_id)
                request.post(url, {token: token_id}, {
                    headers: headers,
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        isLogined(token) {
            /*从token表中获取用户id*/
            return new Promise((resolve, reject) => {
                let {id} = token
                // console.log(id)
                // let filter={"where":{"id":"JqVhXsCKzNgunv78wuzksF5EP6QomZBSrI5mN1j4Jo9b2GNtTY4z9imHqLKFHxml","ttl":1209600}}
                let filter = {
                    include: ['accessTokens'],
                    includefilter: {
                        accessToken: {
                            where: token
                        }
                    }
                }
                request.get(`/user?filter=${JSON.stringify(filter)}`, {
                    headers: getHeaders(),
                    "Content-type": "application/json;charset=UTF-8",
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        addMessage(message, token) {
            /*新增message*/
            return new Promise((resolve, reject) => {
                let url = `/message`
                request.post(url, message, {
                    headers: getHeaders(),
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        getMessages(page, page_num) {
            /*新增message*/
            return new Promise((resolve, reject) => {
                let filter = {
                    limit: page_num,
                    skip: (page - 1) * page_num,
                    order: "createdAt DESC",//倒叙 正序用ASC
                }
                console.log(filter)
                request.get(`/message?filter=${JSON.stringify(filter)}`, {
                    headers: getHeaders(),
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        },
        getUserInfo(id) {
            /*查找user信息*/
            return new Promise((resolve, reject) => {
                let url = `/user/${id}`
                request.get(url, {
                    headers: getHeaders(),
                    'Content-Type': 'application/json'
                }).then(res => {
                    resolve(handleResponse.resolve(res))
                }, rej => {
                    reject(handleResponse.reject(rej))
                })
            })
        }
    }
}

