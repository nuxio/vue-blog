<template>
    <div class="flex-grow-2 ">
        <div class="post-detail pannel">
            <div v-if="post.loading">
                <h2>加载中...</h2>
            </div>
            <div v-if="!post.loading && post.msg">{{post.msg}}</div>
            <div v-if="!post.loading && post.title">
                <h2>{{post.title}}</h2>
                <div class="post-base-info">
                    <span>
                        作者：<router-link :to="`/user/${post.author}`">{{post.author}}</router-link> &nbsp;
                    </span>
                    <span>
                        发布于：{{create_time}} &nbsp;
                    </span>
                    <span>
                        浏览次数：{{post.visit}} &nbsp;
                    </span>
                    <a href="javascript:;" @click="vote" :style="{color: is_voted ? '#dd4b39' : 'inherit'}">
                        <i 
                            :class="['fa', is_voted ? 'fa-thumbs-up' : 'fa-thumbs-o-up']" 
                            aria-hidden="true"
                        ></i>
                        ({{post.up}})
                    </a>
                    <template v-if="is_login">
                        <router-link 
                            :to="`/create/${post._id}`" 
                            title="编辑"
                            class="post-edit-btn"
                            v-if="post.author === user_info.username"
                        >
                            <i class="fa fa-pencil" aria-hidden="true"></i>
                        </router-link>
                        <a 
                            href="javascript:;" 
                            title="删除"
                            class="post-delete-btn"
                            @click="deletePost" 
                            v-if="post.author === user_info.username"
                        >
                            <i class="fa fa-trash-o" aria-hidden="true"></i>
                        </a>
                    </template>
                </div>
                <div class="post-content markdown-body" v-html="marked_content"></div>
            </div>
            <comment :post-id="$route.params.post_id" :marked="marked"></comment>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import marked from 'marked';
    import { mapActions, mapState, mapMutations } from 'vuex';
    import { post as POST } from '../util/fetch';
    import hljs from '../util/highlight.min.js';
    import Comment from './Comment.vue';
    import { URL_BLOG_VOTE, URL_BLOG_DELETE } from '../store/api';
    import { POST_VOTE_UP, POST_VOTE_DOWN } from '../store/mutation-types';

    marked.setOptions({
        sanitize: true,
        highlight: function (code) {
            return hljs.highlightAuto(code).value;
        }
    });

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
            marked_content() {
                return marked(this.post.content);
            },
            create_time() {
                return moment(parseInt(this.post.create_at, 10)).fromNow();
            },
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
            },
            marked(str) {
                return marked(str);
            }
        },
        mounted() {
            this.post_id = this.$route.params.post_id;

            this.requestPostDetail(this.post_id);
        }
    }
</script>

<style>
    @import "../assets/github-markdown.css";
    @import "../assets/atom-one-light.css";

    .post-detail {
        height: 100%;
    }
    .post-content {
        padding: 10px;
        border-top: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
    }
    .post-edit-btn, .post-delete-btn {
        padding: 0 5px;
    }
    .post-delete-btn {
        color: #F48024;
    }
</style>