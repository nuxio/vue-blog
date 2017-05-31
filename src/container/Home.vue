<template>
    <div class="top-container">
        <vue-Header />
        <div class="main">
            <div class="flex-grow-1"></div>
            <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in">
                <router-view></router-view>
            </transition>
            <div class="flex-grow-1"></div>
        </div>
        <vue-footer />
    </div>
</template>

<script>
    import VueHeader from './Header.vue';
    import VueFooter from './Footer.vue';
    import '../assets/global.css';
    import '../assets/default_avatar.jpg';

    export default {
        data() { 
            return {};
        },
        components: {
            VueHeader,
            VueFooter
        }
    }
</script>

<style>
    .top-container {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
    }
    .main {
        display: flex;
        flex: 1;
    }
    .flex-grow-1 {
        flex: 0 0 12em;
    }
    .flex-grow-2 {
        flex: 1;
    } 
    @media (max-width: 768px) {
        .main {
            flex-direction: column;
            flex: 1;
        }
        .flex-grow-1,
        .flex-grow-2 {
            flex: 0;
        }
        fieldset {
            display: flex;
        }
        fieldset >label, fieldset > input[type="text"], fieldset > input[type="password"] {
            width: 100%;
            text-align: left;
        }
    }
    .fadeOut,.fadeIn {
        animation-duration: .3s;
    }
</style>