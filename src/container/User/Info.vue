<template>
    <div class="flex-grow-2">
        <div class="pannel">
            <h2>基本信息</h2>
            <div class="user-profile">
                <div class="user-face">
                    <img :src="user.avatar_url" class="user-avatar" />
                    <h2>{{ username }}</h2>
                </div>
                <div>
                    <p>邮箱：{{user.email}}</p>
                    <p>电话：{{user.mobile}}</p>
                    <p>性别：{{user.gender}}</p>
                    <p>简介：{{user.introduce}}</p>
                    <p v-if="user.username == login_user.username">
                        <router-link :to="`/user/${user.username}/edit`">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>编辑
                        </router-link>
                    </p>
                </div>
            </div>
            <h2>博客列表</h2>
            <div class="user-post-list" v-if="user._id">
                <post-list :author="user._id" />
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import PostList from '../Post/List.vue';

    export default {
        components: { PostList },
        data() {
            return {
                username: ''
            };
        },
        computed: {
            ...mapState({
                user(state) {
                    return state.user.user_list.loading ? {} : (state.user.user_list[this.username] || {});
                },
                loading: state => state.user.user_list.loading,
                login_user: state => state.user.user_info
            })
        },
        methods: {
            ...mapActions(['requestUserInfo']),
            setUserData() {
                if(!this.user.username) {
                    this.requestUserInfo({username: this.username});
                }
            }
        },
        mounted() {
            this.username = this.$route.params.username;
            this.setUserData();
        },
        beforeRouteUpdate(to, from, next) {
            this.username = to.params.username;
            this.setUserData();
        }
    }
</script>

<style>
.user-profile {
    display: flex;
    margin-top: 50px;
}
.user-face {
    width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.user-avatar {
    display: block;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #eee;
    overflow: hidden;
}
</style>