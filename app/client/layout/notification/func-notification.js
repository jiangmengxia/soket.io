import Notification from './notification.vue'

export default {
    extends: Notification,
    computed: {
        //覆盖原始组件的样式
        style() {
            return {
                position: 'fixed',
                right: '20px',
                bottom: `${this.verticalOffset}px`
            }
        }
    },
    data() {
        return {
            verticalOffset: 0,
            autoClose: 15000,
            visible: false,
            height: 0
        }
    },
    methods: {
        afterEnter() {
            this.height = this.$el.offsetHeight
            console.log(this.height)
        },
        createTimer() {
            if (this.autoClose) {
                this.timer = setTimeout(() => {
                    this.visible = false
                }, this.autoClose)
            }
        }
    },
    mounted() {
        this.createTimer()
        this.visible = true
    },
    beforeDestroy() {
        if (this.timer) clearTimeout(this.timer)
    }
}
