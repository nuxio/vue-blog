<template>
    <div class="home">
        <h1>Hello App!</h1>
        <p>
            <router-link to="/">Home</router-link>
            <router-link to="/login">Login</router-link>
            <router-link to="/register">Regist</router-link>
        </p>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        data() { 
            return {};
        }
    }
</script>