<template>
    <div>
        <h3 class="sub-title">评论列表：</h3>
        <div class="comment-list">
            <p v-if="loading" class="comment-list-loading">评论加载中...</p>
            <p v-if="!loading && !list.length">暂无评论</p>
            <ul v-if="!loading && list.length">
                <li v-for="(c, index) in list" class="comment-item">
                    <div class="comment-item-user">
                        <router-link :to="`/user/${c.author.username}`">
                            <img :src="c.author.avatar_url" />
                            <br />
                            {{c.author.username}}
                        </router-link>
                    </div>
                    <div>
                        <div class="comment-item-info">
                            {{index+1}}楼 · {{getCreateTime(c.create_at)}}
                            <a href="javascript:;" @click="vote(c)">
                                <i :class="['fa', isVoted(c.ups) ? 'fa-thumbs-up' : 'fa-thumbs-o-up']" aria-hidden="true"></i>({{c.up}})
                            </a>
                            <a href="javascript:;" v-if="is_login && c.author.username === user_info.username" @click="deleteComment(c._id)">删除</a>
                        </div>
                        <div class="comment-item-content markdown-body" v-html="getMarkedContent(c.content)"></div>
                    </div>
                </li>
            </ul>
            <template v-if="is_login">
                <h3 class="sub-title">我有话说：</h3>
                <form @submit.prevent="submitComment">
                    <editor v-model="content" height="200px" width="100%" display="block"></editor>
                    <br />
                    <button type="submit" :disabled="loading_submit" class="btn btn-primary">{{loading_submit ? '提交中...' : '提交'}}</button>
                </form>
            </template>
            <div v-else>
                <router-link to="/login">登录</router-link>后即可发表评论
            </div>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import { mapMutations, mapState } from 'vuex';
    import { RECEIVE_COMMENT_LIST, COMMENT_VOTE_UP, COMMENT_VOTE_DOWN, COMMENT_DELETE } from '../store/mutation-types';
    import { URL_GET_COMMENT_LIST, URL_SUBMIT_COMMENT, URL_COMMENT_VOTE, URL_COMMENT_DELETE } from '../store/api';
    import { get as GET, post as POST } from '../util/fetch';
    import Dialog from '../component/Dialog';
    import Editor from '../component/Editor';
    
    export default {
        components: { Editor },
        props: {
            postId: {
                type: String,
                required: true
            },
            marked: {
                type: Function,
                required: true
            }
        },
        data() {
            return {
                loading: false,
                content: '',
                loading_submit: false,
                loading_vote: false
            };
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login,
                list(state) {
                    return state.comment.count ? (state.comment.id_map[this.postId] || []) : [];
                },
                user_info: state => state.user.user_info
            })
        },
        methods: {
            ...mapMutations([RECEIVE_COMMENT_LIST, COMMENT_VOTE_UP, COMMENT_VOTE_DOWN, COMMENT_DELETE]),
            submitComment() {
                this.content = this.content.trim();
                if(!this.content) {
                    this.$alert('请输入评论内容');
                    return false;
                }

                let data = {
                    content: this.content
                };

                this.loading_submit = true;

                POST(URL_SUBMIT_COMMENT.replace(':post_id', this.postId), data)
                .then(json => {
                    this.loading_submit = false;
                    if(json.msg === 'ok') {
                        this.$alert('评论成功');
                        this.content = '';
                        this.getCommentList();
                    } else {
                        alert(json.msg);
                    }
                });
            },
            getCommentList() {
                this.loading = true;
                GET(URL_GET_COMMENT_LIST.replace(':post_id', this.postId))
                .then(json => {
                    this.loading = false;

                    if(json.msg === 'ok') {
                        this[RECEIVE_COMMENT_LIST]({post_id: this.postId, comments: json.comments});
                    } else {
                        alert(json.msg);
                    }
                });
            },
            getMarkedContent(content) {
                return this.marked(content);
            },
            vote(c) {
                if(!this.is_login) {
                    this.$alert('您还未登录，请先登录');
                    return false;
                }

                this.loading_vote = true;

                POST(URL_COMMENT_VOTE.replace(':comment_id', c._id))
                .then(json => {
                    this.loading_vote = false;

                    if(json.msg === 'ok') {
                        let payload = {
                            post_id: this.postId,
                            comment_id: c._id,
                            user: {
                                username: this.user_info.username,
                                avatar_url: this.user_info.avatar_url
                            }
                        };
                        if(json.action === 'up') {
                            this[COMMENT_VOTE_UP](payload);
                        } else {
                            this[COMMENT_VOTE_DOWN](payload);
                        }
                    } else {
                        alert(json.msg);
                    }
                });
            },
            getCreateTime(t) {
                return moment(parseInt(t, 10)).fromNow();
            },
            isVoted(ups) {
                if(!this.is_login) { return false; }

                let index = -1;
                for(let i = 0; i < ups.length; i++) {
                    if(ups[i].username === this.user_info.username) {
                        index = i;
                        break;
                    }
                }
                return index !== -1;
            },
            deleteComment(id) {
                this.$confirm('确定删除此条评论？', () => {
                    POST(URL_COMMENT_DELETE, {comment_id: id})
                    .then(json => {
                        if(json.msg === 'ok') {
                            alert('删除成功');
                            this[COMMENT_DELETE]({post_id: this.postId, comment_id: id});
                        } else {
                            alert(json.msg);
                        }
                    });
                });
            }
        },
        mounted() {
            this.getCommentList();
        }
    }
</script>

<style>
    .comment-item {
        display: flex;
        margin-bottom: 15px;
        border-bottom: 1px solid #e5e5e5;
    }
    .comment-item-user {
        height: 80px;
        width: 60px;
        margin-right: 10px;
    }
    .comment-item-user img {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        overflow: hidden;
    }
    .comment-item-user>a:hover {
        border-bottom: 0;
    }
    .comment-item-info {
        font-size: 14px;
        color: #7f8c8d;
    }
    .comment-item-content {
        padding: 10px 0;
    }
</style>