import Component from './func-notification'
import Vue from 'vue'

let instances = []
let seed = 1//组件id生成
const removeInstance = (instance) => {
    if (!instance) return
    let len = instances.length
    const index = instances.findIndex(item => {
        return instance.id === item.id
    })
    instances.splice(index, 1)
    const rmHeight = instance.vm.height
    for (let i = index; i < len - 1; i++) {
        console.log(`before:${instances[i].verticalOffset},rmHeight：${rmHeight},下移：${rmHeight + 16}`)
        let offset = parseInt(instances[i].verticalOffset - rmHeight - 16)
        instances[i].verticalOffset = offset
        console.log(`after:${instances[i].verticalOffset}`)
    }
}

const NotificationConstructor = Vue.extend(Component)
const notify = (options) => {
    if (Vue.prototype.$isServer) return//服务端没有运行环境
    const {autoClose, ...propsData} = options
    const instance = new NotificationConstructor({
        propsData: propsData,//{...propsData}也可以
        data: {
            autoClose: autoClose || 15000
        }
    })

    const id = `notification+${seed}`
    seed++
    instance.id = id
    instance.vm = instance.$mount()//el已经生成，但是没有插入到节点上
    document.body.appendChild(instance.vm.$el)

    instance.vm.$on('closed', () => {
        console.log('on closed')
        removeInstance(instance)
        document.body.removeChild(instance.vm.$el)
        instance.vm.$destroy() // 销毁
    })
    instance.vm.$on('close', () => {
        console.log('on close')
        instance.vm.visible = false
    })

    let verticalOffset = 0
    instances.forEach(item => {
        verticalOffset += item.$el.offsetHeight + 16
    })
    verticalOffset += 16
    instance.verticalOffset = verticalOffset
    instances.push(instance)
    return instance.vm
}

export default notify
