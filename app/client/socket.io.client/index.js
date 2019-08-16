import {BASE_URL} from './socket.io.conf'

import io from 'socket.io-client'

let socket = io.connect(BASE_URL)

function receiver(type) {
    return new Promise(resolve => {
        socket.on('data', function (data) {
            if (data.type == type)
                resolve(data.data)
        })
    })
}

export default {
    /*监听*/
    socketOn(type, cb) {
        socket.on('data', function (data) {
            console.log(data)
            if (data.type == type) {
                if (cb) cb(data.data)
            }
        })
    },
    async socketEmit(type, data) {
        socket.emit(type, data)
        return await receiver(type)
    },
    async login(data) {
        socket.emit('login', data)
        return await
            receiver('login')
    }
    ,
    /*发送消息*/
    async send(data) {
        socket.emit('msg', data)
    }
    ,
}


