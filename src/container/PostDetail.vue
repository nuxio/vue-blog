<template>
    <div class="post-detail">
        <p v-if="post.loading">Loading</p>
        <p v-if="!post.loading && post.msg">{{post.msg}}</p>
        <div v-else="!post.loading">
            <h2>{{post.title}}</h2>
            <p v-if="is_login">
                <a href="javascript:;" @click="vote">{{is_voted ? '取消点赞' : '点赞'}}({{post.up}})</a>
                <router-link :to="`/create/${post._id}`" v-if="post.author === user_info.username">编辑</router-link>
                <a href="javascript:;" @click="deletePost" v-if="post.author === user_info.username">删除</a>
            </p>
            <div v-html="post.content"></div>
        </div>
        <comment :post-id="$route.params.post_id"></comment>
    </div>
</template>

<script>
    import { mapActions, mapState, mapMutations } from 'vuex';
    import Comment from './Comment.vue';
    import { URL_BLOG_VOTE, URL_BLOG_DELETE } from '../store/api';
    import { post as POST } from '../util/fetch';
    import { POST_VOTE_UP, POST_VOTE_DOWN } from '../store/mutation-types';

    export default {
        components: { Comment },
        data() {
            return {
                post_id: '',
                vote_time: 0
            };
        },
        computed: {
            ...mapState({
                post(state) {
                    this.vote_time = state.post.vote_time;
                    // vue，只能监听简单数据类型的变化，所以这里强行扯上loading属性，只要这个有变化，就重新计算这里的post
                    return state.post.id_map.loading ? {loading: true} : (state.post.id_map[this.post_id] || {loading: true});
                },
                is_login: state => state.user.is_login,
                user_info: state => state.user.user_info
            }),
            is_voted() {
                let index = -1;
                let length = this.post.ups ? this.post.ups.length : 0;
                for(let i = 0; i < length; i++) {
                    if(this.post.ups[i].username === this.user_info.username) {
                        index = i;
                        break;
                    }
                }
                return index !== -1;
            }
        },
        methods: {
            ...mapActions(['requestPostDetail']),
            ...mapMutations([POST_VOTE_UP, POST_VOTE_DOWN]),
            vote() {
                POST(URL_BLOG_VOTE.replace(':post_id', this.post_id))
                .then(json => {
                    if(json.msg === 'ok') {
                        let payload = {
                            post_id: this.post_id, 
                            uper: {
                                username: this.user_info.username, 
                                avatar_url: this.user_info.avatar_url
                            }
                        };
                        if(json.action === 'up') {
                            this[POST_VOTE_UP](payload);
                        } else {
                            this[POST_VOTE_DOWN](payload);
                        }
                    } else {
                        alert(json.msg);
                    }
                });
            },
            deletePost() {
                let c = confirm('确认删除此博客？');
                if(c) {
                    POST(URL_BLOG_DELETE, {blog_id: this.post_id})
                    .then(json => {
                        if(json.msg === 'ok') {
                            alert('删除成功');
                            this.$router.push('/');
                        } else {
                            alert(json.msg);
                        }
                    });
                }
            }
        },
        mounted() {
            this.post_id = this.$route.params.post_id;

            this.requestPostDetail(this.post_id);
        }
    }
</script>