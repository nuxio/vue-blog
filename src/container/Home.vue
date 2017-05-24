<template>
    <div class="top-container">
        <header>
            <div class="home">
                <h1><router-link to="/">Hello Vue!</router-link></h1>
            </div>
            <div class="logo">
                <img src="../assets/logo.png" alt="Hello Vue!" />
            </div>
            <div class="nav" @mouseenter="showUserMenu" @mouseleave="hideUserMenu">
                <template v-if="is_login">
                    <span class="user-name">你好，<router-link :to="`/user/${user_info.username}`">{{user_info.username}}</router-link></span>
                    <div class="user-menu" v-show="user_menu_show">
                        <ul>
                            <li><router-link to="/create">发布</router-link></li>
                            <li><a @click="logout" href="javascript:;">退出登录</a></li>
                        </ul>
                    </div>
                </template>
                <template v-else>
                    <router-link to="/login">登录</router-link>
                    <router-link to="/register">注册</router-link>
                </template>
            </div>
        </header>
        <div class="main">
            <div class="flex-grow-1"></div>
            <router-view></router-view>
            <div class="flex-grow-1"></div>
        </div>
        <footer>
            mafee@2017
        </footer>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { USER_LOGOUT } from '../store/mutation-types';
    import { URL_USER_LOGOUT } from '../store/api';
    import { post as POST} from '../util/fetch';
    import '../assets/global.css';

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
    .top-container {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
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
        width: 100px;
    }
    .user-name {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .user-menu {
        position: absolute;
        padding: 0 15px;
        background-color: #fff;
        top: 59px;
        border-radius: 5px;
        border: 1px solid #42b983;
    }
    .user-menu >ul > li {
        margin: 15px 0;
    }
    .main {
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        flex: 1;
    }
    .flex-grow-1 {
        flex-grow: 1;
        flex-shrink: 1;
    }
    .flex-grow-2 {
        flex-grow: 2;
        flex-shrink: 0;
    } 
</style>