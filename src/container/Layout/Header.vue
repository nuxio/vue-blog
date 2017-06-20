<template>
    <header class="mb50">
        <nav>
            <div class="home">
                <h1><router-link to="/"><img src="../../assets/img/logo.png" alt="Hello Vue!" />Hello Vue!</router-link></h1>
            </div>
            <div class="user-nav" @mouseenter="showUserMenu" @mouseleave="hideUserMenu">
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
        </nav>
    </header>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import Dialog from '../../component/Dialog';
    import Toast from '../../component/Toast';
    import { USER_LOGOUT } from '../../store/mutation-types';
    import { URL_USER_LOGOUT } from '../../store/api';
    import { post as POST} from '../../util/fetch';

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
                this.$confirm('确定退出登录？', () => {
                    POST(URL_USER_LOGOUT).then(json => {
                        if(json.msg === 'ok') {
                            this[USER_LOGOUT]();
                            this.$router.push('/');
                        } else {
                            this.$toast.error('退出登录失败，请稍后再试');
                        }
                    });
                });
            }
        }
    }
</script>

<style>
header {
    background-color: #333;
}
nav {
    margin: 0 auto;
    width: 80%;
    display: flex;
    justify-content: space-between;
}
@media (max-width: 1310px) {
    nav {
        width: 95%;
    }
}
.home >h1 >a {
    color: #42b983;
}
.home >h1 >a:hover {
    border-bottom: 0;
}
.home >h1 img {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    margin-right: 10px;
}
.user-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 130px;
    min-width: 80px;
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
    top: 65px;
    border-radius: 5px;
    border: 1px solid #42b983;
    z-index: 100;
}
.user-menu >ul > li {
    margin: 15px 0;
}
</style>