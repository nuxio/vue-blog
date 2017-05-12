<template>
    <div class="user">
        <h2>{{ $route.params.id }}</h2>
        <router-link :to="`/user/${$route.params.id}/profile`">UserProfile</router-link>
        <router-link :to="`/user/${$route.params.id}/posts`">UserPosts</router-link>
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