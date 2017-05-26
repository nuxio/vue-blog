<template>
    <header>
        <div class="home">
            <h1><router-link to="/">Hello Vue!</router-link></h1>
        </div>
        <div class="logo">
            <img src="../assets/logo.png" alt="Hello Vue!" />
        </div>
        <div class="nav" @mouseenter="showUserMenu" @mouseleave="hideUserMenu">
            <template v-if="is_login">
                <router-link class="user-name" :to="`/user/${user_info.username}`">
                    <img :src="user_info.avatar_url" />
                    {{user_info.username}}
                </router-link>
                <div class="user-menu" v-show="user_menu_show">
                    <ul>
                        <li><router-link to="/create">发布</router-link></li>
                        <li><a @click="logout" href="javascript:;">退出登录</a></li>
                    </ul>
                </div>
            </template>
            <template v-else>
                <router-link class="user-name" to="/login">登录</router-link>
                <router-link class="user-name" to="/register">注册</router-link>
            </template>
        </div>
    </header>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { USER_LOGOUT } from '../store/mutation-types';
    import { URL_USER_LOGOUT } from '../store/api';
    import { post as POST} from '../util/fetch';

    export default {
        data() {
            return {
                user_menu_show: false
            };
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login,
                user_info: state => state.user.user_info
            })
        },
        methods: {
            ...mapMutations([USER_LOGOUT]),
            showUserMenu () {
                this.is_login && (this.user_menu_show = true);
            },
            hideUserMenu () {
                this.is_login && (this.user_menu_show = false);
            },
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
    header {
        display: flex;
        justify-content: space-around;
        background-color: #489fdf;
        margin-bottom: 50px;
    }
    .home >h1 >a {
        color: #fff;
    }
    .home >h1 >a:hover {
        border-bottom-color: #fff;
    }
    .logo, .logo>img {
        width: 40px;
        height: 40px;
        align-self: center;
    }
    .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 130px;
    }
    .user-name {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
    }
    .user-name >img {
        height: 50px;
        width: 50px;
        vertical-align: middle;
        border: 1px solid #fff;
        border-radius: 50%;
        overflow: hidden;
    }
    .user-name:hover {
        border-bottom: 0;
    }
    .user-menu {
        position: absolute;
        padding: 0 15px;
        background-color: #fff;
        top: 75px;
        border-radius: 5px;
        border: 1px solid #42b983;
        z-index: 100;
    }
    .user-menu >ul > li {
        margin: 15px 0;
    }
</style>