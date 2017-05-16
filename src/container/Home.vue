<template>
    <div class="home">
        <h1>Hello App!</h1>
        <p>
            <router-link to="/">Home</router-link>
            <template v-if="is_login">
                你好，{{user_info.username}}
                <router-link to="/create">Create</router-link>
                <span @click="logout" class="logout">Logout</span>
            </template>
            <template v-else>
                <router-link to="/login">Login</router-link>
                <router-link to="/register">Regist</router-link>
            </template>
        </p>
        <router-view></router-view>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { USER_LOGOUT } from '../store/mutation-types';
    import { URL_USER_LOGOUT } from '../store/api';
    import { post as POST} from '../util/fetch';

    export default {
        data() { 
            return {};
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login,
                user_info: state => state.user.user_info
            })
        },
        methods: {
            ...mapMutations([USER_LOGOUT]),
            logout() {
                let c = confirm('确定退出？');
                if(c) {
                    POST(URL_USER_LOGOUT)
                    .then(json => {
                        if(json.msg === 'ok') {
                            this[USER_LOGOUT]();
                        } else {
                            alert('退出登录失败，请稍后再试');
                        }
                    })
                }
            }
        }
    }
</script>

<style>
    .logout {
        cursor: pointer;
    }
</style>