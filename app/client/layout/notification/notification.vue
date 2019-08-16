<template>
    <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
        <div class="notification" :style="style" v-show="visible">
            <div class="content">{{content}}</div>
            <a class="button" @click="closeNotify">{{closeText}}</a>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "notification",
        props: {
            content: {
                required: true,
                type: String
            },
            closeText: {
                default: '关闭',
                type: String
            },
        },
        computed: {
            style() {
                return {}
            }
        },
        methods: {
            afterLeave() {
                this.$emit('closed')
            },
            afterEnter() {
            },
            closeNotify() {
                this.$emit('close')
            }
        }
    }
</script>

<style scoped>
    .notification {
        position: fixed;
        z-index: 100;
        bottom: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 1);
        padding: 5px 15px;
        display: flex;
        transition: all .5s;
    }

    .button {
        color: #ff7777;
        padding: 0;
        margin-left: 15px;
        cursor: pointer;
    }

    .content {
        flex-grow: 1;
        color: #ffffff;
        cursor: pointer;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>
