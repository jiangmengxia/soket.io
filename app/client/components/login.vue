<template>
    <div class="login">
        <h4>聊天室登录窗口</h4><br/>
        <form class="form" @submit="login">
            <div class="form-item">
                <input type="text" v-model="username" placeholder="请输入用户名："/>
            </div>
            <div class="form-item">
                <button class="btn-submit">登录</button>
            </div>
        </form>
    </div>
</template>
<script>
    export default {
        name: "login",
        data() {
            return {
                username: ''
            }
        },
        methods: {
            login(e) {
                e.preventDefault()
                if(this.username.trim()===''){
                    this.$notify({
                        content: '用户名不能为空',
                        autoClose: 2000,
                    })
                    return
                }
                this.$api.login({username: this.username}).then(data => {
                    // console.log('login back', data)
                    let userInfo = data.data
                    localStorage.setItem('user', JSON.stringify(userInfo))
                    if (data.success == true) {
                        this.$notify({
                            content: '登录成功',
                            autoClose: 2000,
                        })
                        this.$router.push('/chart')
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .login {
        position: absolute;
        width: 300px;
        height: auto;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, .1), 0 0 1px 1px rgba(0, 0, 0, .1);
        padding: 32px;
        background: #f1f1f1;

    }

    input {
        height: 40px;
        line-height: 40px;
        outline: none;
        padding: 0 5px;
        border: none;
        box-shadow: 1px 1px 1px 1px deepskyblue inset, 0 0 1px 1px deepskyblue inset;
        flex-grow: 1;
    }

    input:focus {
        box-shadow: 1px 1px 1px 1px rgba(0, 255, 255, .8) inset, 0 0 1px 1px rgba(0, 255, 255, .8) inset;
    }

    .form-item {
        display: flex;
        margin-top: 10px;
    }

    .btn-submit {
        background: deepskyblue;
        height: 40px;
        border: 1px solid deepskyblue;
        color: #fff;
        flex-grow: 1;
        margin-top: 20px;
    }
</style>
