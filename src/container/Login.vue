<template>
    <div class="login">
        <p>Login</p>
        <form @submit.prevent="login">
            username: <input type="text" v-model="username" required /><br />
            password: <input type="password" v-model="password" required /><br />
            remember: <input type="checkbox" v-model="remember" value="1" /><br />
            <button type="submit">Login</button>
        </form>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { post as POST } from '../util/fetch';
    import { URL_USER_LOGIN } from '../store/api';
    import { USER_LOGIN } from '../store/mutation-types';

    const md5 = require('crypto-js/md5');

    export default {
        data() {
            return {
                username: '',
                password: '',
                remember: false,
                from: ''
            };
        },
        beforeRouteEnter: (to, from, next) => {
            next(vm => {
                vm.from = from.path;
            });
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login
            })
        },
        methods: {
            ...mapMutations([USER_LOGIN]),
            login() {
                this.username = this.username.trim();
                this.password = this.password.trim();

                if(!this.username) {
                    alert('请输入用户名');
                    return false;
                }
                if(!this.password) {
                    alert('请输入密码');
                    return false;
                }

                let data = {
                    username: this.username,
                    password: md5(this.password).toString()
                };
                this.remember && (data.remember = 1);

                POST(URL_USER_LOGIN, data)
                .then(json => {
                    if(json.msg === 'ok') {
                        this[USER_LOGIN]({user: json.user, remember: this.remember});
                        alert('登录成功');
                        this.$router.push((this.from && this.from !== '/register') ? this.from : '/');
                    } else {
                        alert(json.msg);
                    }
                });
            }
        },
        mounted() {
            if(this.is_login) {
                this.$router.push(this.from || '/');
            }
        }
    }
</script>