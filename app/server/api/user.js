const createDb = require('../db/apicloud.db')
const config = require('../db/apicloud.db.conf')
// const handleRequest = require('../utils')

const db = createDb(config.appId, config.appKey)
module.exports = {
    /*判断是否存在，存在返回错误提示，否则添加用户，并给出token*/
    login(username) {
        return new Promise((resolve, reject) => {
            db.isUserExist('user', username).then(res => {
                /*用户不存在，创建再登录*/
                if (res.data.length === 0) {
                    // console.log(`用户${username}不存在`)
                    db.addUser('user', username).then(res => {
                        console.log('add', res.data)
                        if (res.success === true) {
                            db.login('user', username).then(res => {
                                // console.log('用户不存在，创建再登录', res.data)
                                resolve(res.data)
                            })
                        }
                    })
                } else {
                    /*用户存在 直接登录*/
                    db.login('user', username).then(res => {
                        resolve(res.data)
                    })
                }
            }, rej => {
                reject(rej)
            })
        })
    },
    logout(token_id) {
        return new Promise((resolve, reject) => {
            db.logout('user', token_id).then(res => {
                console.log(res)
                resolve(res)
            }, rej => {
                reject(rej)
            })
        })
    },
    isLogined(token) {
        return new Promise((resolve, reject) => {
            db.isLogined(token).then(res => {
                // console.log('获取用户登录与否', res)
                let user = null
                res.data.forEach(item => {
                    let {accessTokens} = item
                    if (accessTokens.length > 0) {
                        if (accessTokens[0].id == token.id) {
                            user = {
                                username: item.username,
                                id: item.id,
                            }
                        }
                    }
                })
                if (user !== null) {
                    console.log(user)
                    resolve({
                        success: true,
                        data: user
                    })
                }
            },rej=>{
                reject(rej)
            })
        })
    },
    addMessage(user, token, content) {
        return new Promise((resolve, reject) => {
            let message = {
                user: user,
                content: content,
                "user(uz*R*id)": user.id
            }
            db.addMessage(message, token).then(res => {
                resolve(res)
            },rej=>{
                reject(rej)
            })
        })
    },
    getMessages(page, page_num) {
        return new Promise((resolve, reject) => {
            db.getMessages(page, page_num).then(res => {
                resolve(res)
            },rej=>{
                reject(rej)
            })
        })
    },
}
