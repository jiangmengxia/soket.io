/*app.js*/
/*构建http服务*/
const http = require('http').createServer()
/*引入socket.io*/
const io = require('socket.io')(http);
const config = require('./socket.io.conf')
const errCode = require('./code.conf')
/*定义监听端口，可以自定义，端口不要被占用*/
const PORT = 3000;
/*监听端口*/
http.listen(PORT, () => {
    console.log('app listen at ' + PORT);
});


const USER_API = require('./api/user')

io.on('connection', function (socket) {
    console.log("server connecting");
    socket.on(config.LOGIN, function (data) {
        let {username} = data
        if (username) {
            USER_API.login(username).then(data => {
                data.username = username
                send(config.LOGIN, {
                    success: true,
                    data: data
                })
            }, rej => {
                send(config.LOGIN, rej)
            })
        } else {
            send(config.LOGIN, {
                success: false,
                message: '用户名不能为空！',
                code: errCode.USERNAME_CAN_NOT_BE_NULL
            })
        }
    })
    socket.on(config.MSG, (data) => {
        let {token, content} = data
        // console.log(`msg from ${token.userId} ,msg is ${content}`)
        if (token) {
            USER_API.isLogined(token).then(res => {
                let user = res.data
                USER_API.addMessage(user, token, content).then(res => {
                    sendToAll(config.MSG, res)
                })
            })
        } else {
            send(config.LOGIN, {
                success: false,
                message: '用户未登录！',
                code: errCode.USER_UN_LOGIN
            })
        }
    })

    socket.on(config.MSG_RECORDS, (data) => {
        let {page, page_num} = data
        USER_API.getMessages(page, page_num).then(res => {
            send(config.MSG_RECORDS, res)
        }, rej => {
            send(config.MSG_RECORDS, rej)
        })
    })
    socket.on(config.LOGOUT, (token_id) => {
        USER_API.logout(token_id).then(res => {
            send(config.LOGOUT, res)
        }, rej => {
            send(config.LOGOUT, rej)
        })
    })


    const send = function (type, data) {
        socket.emit('data', {
            type: type,
            data: data
        })
    }

    const sendToAll = function (type, data) {
        io.emit('data', {
            type: type,
            data: data
        })
    }
});
