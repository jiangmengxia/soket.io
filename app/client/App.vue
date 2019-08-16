<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "App",
    }
</script>

<style>
    html, body, #app {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: auto;
    }

    button:active {
        opacity: .5;
    }

    .text-center {
        text-align: center;
    }

    .text-right {
        text-align: right;
    }

    .text-left {
        text-align: left;
    }
</style>
