<template>
    <div class="flex-grow-2">
        <div class="pannel register-form-wrap">
            <h2>注册</h2>
            <form @submit.prevent="register" class="register-form">
                <fieldset>
                    <label for="username">用户名：</label>
                    <input id="username" type="text" v-model="username" required />
                </fieldset>
                <fieldset>
                    <label for="password">密&nbsp;&nbsp;&nbsp;码：</label>
                    <input id="password" type="password" v-model="password" required />
                </fieldset>
                <fieldset>
                    <label for="password_confirm">密码确认：</label>
                    <input id="password_confirm" type="password" v-model="password_confirm" required />
                </fieldset>
                <fieldset>
                    <button type="submit">提交</button>
                </fieldset>
            </form>
        </div>
    </div>
</template>

<script>
    import { post as POST } from '../util/fetch';
    import { URL_USER_REGISTER } from '../store/api';
    // md5 需要用require的方式引入，import不行
    const md5 = require('crypto-js/md5');

    export default {
        data() {
            return {
                username: '',
                password: '',
                password_confirm: '',
                username_regex: /^[0-9a-z_]{3,24}$/,
                password_regex: /^.{6,24}$/
            };
        },
        methods: {
            register() {
                this.username = this.username.trim();
                this.password = this.password.trim();
                this.password_confirm = this.password_confirm.trim();

                if(!this.username) {
                    alert('请输入用户名');
                    return false;
                }
                if(!this.username_regex.test(this.username)) {
                    alert('用户名格式不正确');
                    return false;
                }
                if(!this.password) {
                    alert('请输入密码');
                    return false;
                }
                if(!this.password_confirm) {
                    alert('请输入确认密码');
                    return false;
                }
                if(this.password !== this.password_confirm) {
                    alert('两次输入密码不一致');
                    return false;
                }
                if(!this.password_regex.test(this.password)) {
                    alert('请输入长度为6到24的密码');
                    return false;
                }

                let data = {
                    username: this.username,
                    password: md5(this.password).toString(),
                    password_confirm: md5(this.password_confirm).toString()
                };

                POST(URL_USER_REGISTER, data)
                .then(json => {
                    if(json.msg === 'ok') {
                        alert('注册成功');
                        this.$router.push('/login');
                    } else {
                        alert(json.msg);
                    }
                });
            }
        }
    }
</script>

<style>
    .register-form-wrap {
        height: 100%;
    }
    .register-form {
        margin: 0 auto;
        width: 500px;
    }
</style>