<template>
    <div class="loading text-center">
        <div class="circle"></div>
        <div class="text">loading...</div>
    </div>
</template>

<script>
    export default {
        name: "loading-animation"
    }
</script>

<style scoped>
    .circle {
        width: 8px;
        height: 8px;
        border: 2px solid #afafaf;
        border-radius: 4px;
        display: inline-block;
        animation: whirl 1000ms ease-in-out infinite alternate-reverse;
    }
    .loading{
        padding: 16px;
    }
    .text{
        color: #aaa;
        font-size: 10px;
    }
    @keyframes  whirl {
        0% {
            transform: rotate(0);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>
