<template>
    <div class="chart-room">
        <div class="chart-title">多人聊天室</div>
        <div class="chart-body" id="chart" @scroll="scrollHandler">
            <div class="loading" v-show="showTopLoading&&canScroll">
                <loading-animation></loading-animation>
            </div>
            <div v-for="(chart,index) in list" :key="chart.id+index">
                <div class="username" :class="{'text-right':chart.user_id===cur_user_id}">{{chart.username}}:</div>
                <div class="chart-content" :class="{'local':chart.user_id===cur_user_id}">
                    <div class="content">
                        {{chart.content}}
                    </div>
                </div>
                <div class="text-center chart-date">{{new Date(chart.createdAt).Format('yyyy-MM-dd HH:mm:ss')}}</div>
            </div>
        </div>
        <div class="input-bar">
            <input class="input-box" v-model="input"/>
            <button class="btn-send" @click="send">发送</button>
        </div>
    </div>
</template>

<script>
    // import API from '../../server/api/user'

    import LoadingAnimation from "../layout/loading-animation";

    export default {
        name: "chart-room",
        components: {LoadingAnimation},
        data() {
            return {
                input: '',
                list: [],
                page: 1,
                page_num: 6,
                canScroll: true,
                showTopLoading: false,
                lastScrollTop: 0,
                curScrollTop: 0,

            }
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                //因为当钩子执行前，组件实例还没被创建
                // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
                let user = JSON.parse(localStorage.getItem('user'))
                console.log(user)
                !user ? vm.$router.replace('/login') : null
            });
        },
        computed: {
            cur_user_id() {
                let user = JSON.parse(localStorage.getItem('user'))
                return !!user ? JSON.parse(localStorage.getItem('user')).userId : ''
            }
        },
        methods: {
            send() {
                let {id, ttl} = JSON.parse(localStorage.getItem('user'))
                let token = {
                    id: id,
                    ttl: ttl,
                }
                let params = {
                    token: token,
                    content: this.input
                }
                this.$api.send(params)
            },
            scrollHandler(e) {
                if (this.canScroll === false) return
                let scrollTop = e.target.scrollTop
                console.log('showTopLoading', this.showTopLoading)
                if (this.showTopLoading === true) {
                    this.lastScrollTop = this.curScrollTop
                    this.curScrollTop = scrollTop
                    return
                }

                if (this.lastScrollTop > 30) {
                    this.lastScrollTop = this.curScrollTop
                    this.curScrollTop = scrollTop
                    return
                } else {
                    if (this.lastScrollTop > scrollTop) {
                        this.showTopLoading = true
                        let el = document.getElementById('chart')
                        let last_height = el.scrollHeight
                        this.getNextPage(() => {
                            this.$nextTick(() => {
                                let cur_height = el.scrollHeight
                                el.scrollTop = cur_height - last_height
                                this.lastScrollTop = el.scrollTop
                                this.curScrollTop = el.scrollTop
                                el.scrollBy(0, this.lastScrollTop)
                                this.$nextTick(() => {
                                    this.showTopLoading = false
                                })
                            })
                        })
                    }
                }
                this.lastScrollTop = this.curScrollTop
                this.curScrollTop = scrollTop
            },
            getNextPage(cb) {
                this.$api.socketEmit('msg_records', {
                    page: this.page,
                    page_num: this.page_num
                }).then(res => {
                    console.log('--页--', this.page, this.page_num, res.data)
                    if (res.data.length < this.page_num) {
                        this.canScroll = false
                    }
                    res.data.map(data => {
                        let {user} = data
                        this.list.unshift({
                            username: user.username,
                            content: data.content,
                            createdAt: data.createdAt,
                            id: data.id,
                            user_id: user.id
                        })
                    })
                    this.page++
                    if (cb) cb()
                })
            },
            socketOn() {
                this.$api.socketOn('msg', (res) => {
                    let {data} = res
                    let {user} = data
                    this.list.push({
                        username: user.username,
                        content: data.content,
                        createdAt: data.createdAt,
                        id: data.id,
                        user_id: user.id
                    })
                    this.input = ''
                    this.$nextTick(() => {
                        this.scrollBottom()
                    })
                })
            },
            scrollBottom() {
                let el = document.getElementById('chart')
                let scrollHeight = el.scrollHeight
                el.scrollTop = scrollHeight
                this.lastScrollTop = scrollHeight
                this.curScrollTop = scrollHeight
            }
        },
        created() {
            this.getNextPage(() => {
                this.$nextTick(() => {
                    this.scrollBottom()
                    this.socketOn()
                })
            })
        },
        beforeRouteLeave(to, from, next) {
            let {id} = JSON.parse(localStorage.getItem('user'))
            this.$api.socketEmit('logout', id).then(res => {
                this.$notify({
                    content: '退出登录',
                    autoClose: 2000,
                })
                next()
            })
        }
    }
</script>

<style scoped>
    .chart-room {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        max-width: 400px;
        margin: auto;
        display: flex;
        flex-direction: column;
    }

    .loading {
        position: absolute;
        right: 0;
        left: 0;
        background: rgba(255, 255, 255, .3);
        margin-top: -8px;
    }

    .chart-title {
        height: 40px;
        background: darkblue;
        color: #fff;
        line-height: 40px;
        text-align: center;
    }

    .chart-body {
        flex-grow: 1;
        overflow-y: auto;
        background: #f1f1f1;
        padding: 16px;
    }

    .chart-content {
        margin-block-start: 15px;
    }

    .chart-content > .content {
        background: #fff;
        padding: 10px;
        border-radius: 5px;
        display: inline-block;
        line-height: 170%;
    }

    .chart-content.local > .content {
        background: #ffdd44;
    }

    .chart-content.local {
        text-align: right;
    }

    .chart-date {
        color: #777;
        font-size: 10px;
        margin-top: 16px;
    }

    .input-bar {
        height: 40px;
        display: flex;
        align-items: center;
    }

    .btn-send {
        background: deepskyblue;
        height: 40px;
        flex-basis: 60px;
        border: 1px solid deepskyblue;
        color: #fff;
    }

    .username {
        color: #777;
        font-size: 12px;
    }

    .input-box {
        flex: 1;
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 5px;
        border: none;
        box-shadow: 1px 1px 1px 1px deepskyblue inset, 0 0 1px 1px deepskyblue inset;
    }

    .input-box:focus {
        box-shadow: 1px 1px 1px 1px rgba(0, 255, 255, .8) inset, 0 0 1px 1px rgba(0, 255, 255, .8) inset;
    }
</style>
