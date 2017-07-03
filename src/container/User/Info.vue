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
            <template v-if="drafts.length">
                <h2>草稿列表</h2>
                <div class="user-draft-list">
                    <ul>
                        <li v-for="(draft, key) in drafts" :key="key" v-if="key != 'length'">
                            <span v-text="key"></span>
                            <span>标题：<b>{{draft.title}}</b></span>
                            <span>最近保存于：{{new Date(draft.save_time).toLocaleString()}}</span>
                            <router-link :to="`/create/${key}`">编辑</router-link>
                        </li>
                    </ul>
                </div>
            </template>
            <h2>博客列表</h2>
            <div class="user-post-list" v-if="user._id">
                <post-list :author="user._id"></post-list>
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
                username: '',
                drafts: {
                    length: 0
                }
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
                this.requestUserInfo({username: this.username});
            },
            setDraft(vm, to) {
                let name = `DRAFTS_OF_${to.params.username}`;
                let drafts = JSON.parse(window.localStorage.getItem(name)) || {};
                drafts.length = Object.keys(drafts).length;
                vm.$set(vm, 'drafts', drafts);
            }
        },
        mounted() {
            this.username = this.$route.params.username;
            this.setUserData();
        },
        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.setDraft(vm, to);
            });
        },
        beforeRouteUpdate(to, from, next) {
            this.username = to.params.username;
            this.setDraft(this, to);
            this.setUserData();
            next();
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
.user-draft-list {
    border: 1px solid #e7eaf2;
    box-shadow: 0 1px 3px 0 rgba(0,33,77,.05);
    background: #fff;
    overflow: visible;
    border-radius: 4px;
    padding: 0 20px;
}
.user-draft-list ul li {
    margin: 10px 0;
}
</style>