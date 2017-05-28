<template>
    <div class="flex-grow-2">
        <div class="edit-wrap pannel">
            <div class="edit-avatar-wrap">
                <h3 class="user-name">编辑头像</h3>
                <div class="user-avatar" @mouseenter="enter" @mouseleave="leave">
                    <img :src="avatar_url" />
                    <div class="avatar-upload-btn" v-show="hover_on_avatar" @click="triggerUpload">
                        <input type="file" name="avatar" class="avatar-input" ref="avatar_input" @change="upload" />
                        <span v-if="!uploading">点击上传</span>
                        <span v-else>上传中...</span>
                    </div>
                </div>
                <button type="button" @click="saveAvatarUrl" :disbaled="uploading || saving_avatar">保存</button>
            </div>
            <form @submit.prevent="submit" class="edit-user-form">
                <h3 class="user-name">编辑基本信息</h3>
                <fieldset>
                    <label for="mobile">电话：</label>
                    <input type="text" id="mobile" v-model="mobile" placeholder="高兴填就填" />
                </fieldset>
                <fieldset>
                    <label for="email">邮箱：</label>
                    <input type="text" id="email" v-model="email" placeholder="填了方便联系" />
                </fieldset>
                <fieldset>
                    <label for="gender">性别：</label>
                    <input type="text" id="gender" v-model="gender" placeholder="这不是选择题" />
                </fieldset>
                <fieldset>
                    <label for="introduce">简介：</label>
                    <input type="text" id="introduce" v-model="introduce" placeholder="哟，这是哪位爷啊~" />
                </fieldset>
                <fieldset>
                    <label>&nbsp;</label>
                    <button type="submit">保存</button>
                </fieldset>
            </form>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import { post as POST, upload as UPLOAD } from '../util/fetch';
    import { URL_USER_INFO, URL_USER_UPLOAD_AVATAR } from '../store/api';
    import { USER_LOGIN } from '../store/mutation-types';

    export default {
        data() {
            return {
                hover_on_avatar: false,
                uploading: false,
                saving_avatar: false,
                username: '',
                mobile: '',
                email: '',
                introduce: '',
                gender: '',
                avatar_url: ''
            };
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login,
                login_user: state => state.user.user_info,
                user(state) {
                    return state.user.user_list.loading ? {} : (state.user.user_list[this.username] || {});
                }
            })
        },
        watch: {
            user(nv) {
                this.mobile = nv.mobile;
                this.email = nv.email;
                this.introduce = nv.introduce;
                this.gender = nv.gender;
                this.avatar_url = nv.avatar_url;
            }
        },
        methods: {
            ...mapActions(['requestUserInfo']),
            enter() {
                this.hover_on_avatar = true;
            },
            leave() {
                this.hover_on_avatar = false;
            },
            triggerUpload() {
                this.$refs.avatar_input.click();
            },
            // 上传用户选择的头像
            upload(e) {
                if(!e.target.value) {
                    return false;
                }
                let formData = new FormData();
                formData.append('avatar', e.target.files[0]);

                this.uploading = true;

                UPLOAD({
                    url: URL_USER_UPLOAD_AVATAR.replace(':username', this.username),
                    formData
                })
                .then(json => {
                    this.uploading = false;
                    if(json.msg === 'ok') {
                        this.avatar_url = json.avatar_url;
                    } else {
                        alert(json.msg);
                    }
                    this.$refs.avatar_input.value = '';
                });
            },
            // 保存头像
            saveAvatarUrl() {
                let data = { avatar_url: this.avatar_url };
                
                this.saving_avatar = true;

                POST(URL_USER_INFO.replace(':username', this.username), data)
                .then(json => {
                    this.saving_avatar = false;

                    if(json.msg === 'ok') {
                        alert('保存成功');
                        this.requestUserInfo({ username: this.username });
                    } else {
                        alert(json.msg);
                    }
                });
            },
            // 保存基本信息
            submit() {
                let data = {
                    mobile: this.mobile,
                    email: this.email,
                    introduce: this.introduce,
                    gender: this.gender
                };

                POST(URL_USER_INFO.replace(':username', this.username), data)
                .then(json => {
                    if(json.msg === 'ok') {
                        alert('保存成功');
                        this.requestUserInfo({ username: this.username });
                        this.$router.push(`/user/${this.username}`);
                    } else {
                        alert(json.msg);
                    }
                });
            }
        },
        mounted() {
            if(!this.is_login) {
                this.$router.push('/');
            }
            this.username = this.$route.params.username;
        }
    }
</script>

<style>
    .edit-wrap {
        display: flex;
        margin-top: 50px;
        height: 100%;
    }
    .edit-avatar-wrap {
        width: 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-right: 50px;
    }
    .user-avatar {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        background-color: #eee;
        position: relative;
        margin-bottom: 20px;
        overflow: hidden;
    }
    .user-avatar img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 0;
    }
    .avatar-upload-btn {
        height: 100%;
        width: 100%;
        position: absolute;
        background-color: #000;
        opacity: 0.5;
        border-radius: 50%;
        text-align: center;
        top: 0;
        left: 0;
        color: #fff;
        line-height: 150px;
        cursor: pointer;
    }
    .avatar-input {
        display: none;
    }
</style>