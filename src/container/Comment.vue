<template>
    <div class="comment-list">
        <h5>评论列表：</h5>
        <p v-if="loading" class="comment-list-loading">Loading</p>
        <p v-if="!loading && !list.length">暂无评论</p>
        <ul v-if="!loading && list.length">
            <li v-for="c in list">
                {{c.content}} --- {{c.author}} 
                <a href="javascript:;" @click="vote(c)" v-if="!loading_vote">{{voteText(c.ups)}}({{c.up}})</a>
                <a href="javascript:;" v-else="loading_vote">{{voteText(c.ups)}}({{c.up}})</a>
                <a href="javascript:;" v-if="is_login && c.author === user_info.username" @click="deleteComment(c._id)">删除</a>
            </li>
        </ul>
        <template v-if="is_login">
            <h5>添加评论</h5>
            <form @submit.prevent="submitComment">
                <textarea cols="30" rows="10" v-model="content" required></textarea>
                <button type="submit" :disabled="loading_submit">提交</button>
            </form>
        </template>
        <div v-else>
            您还未登录，<router-link to="/login">去登录</router-link>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { RECEIVE_COMMENT_LIST, COMMENT_VOTE_UP, COMMENT_VOTE_DOWN, COMMENT_DELETE } from '../store/mutation-types';
    import { URL_GET_COMMENT_LIST, URL_SUBMIT_COMMENT, URL_COMMENT_VOTE, URL_COMMENT_DELETE } from '../store/api';
    import { get as GET, post as POST } from '../util/fetch';
    
    export default {
        props: {
            postId: {
                type: String,
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
                    alert('请输入评论内容');
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
                        alert('评论成功');
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
            vote(c) {
                if(!this.is_login) {
                    alert('您还未登录，请先登录');
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
            voteText(ups) {
                if(!this.is_login) { return '点赞'; }

                let index = -1;
                for(let i = 0; i < ups.length; i++) {
                    if(ups[i].username === this.user_info.username) {
                        index = i;
                        break;
                    }
                }
                return index !== -1 ? '取消点赞' : '点赞';
            },
            deleteComment(id) {
                let c = confirm('确定删除此条评论？');
                if(c) {
                    POST(URL_COMMENT_DELETE, {comment_id: id})
                    .then(json => {
                        if(json.msg === 'ok') {
                            alert('删除成功');
                            this[COMMENT_DELETE]({post_id: this.postId, comment_id: id});
                        } else {
                            alert(json.msg);
                        }
                    });
                }
            }
        },
        mounted() {
            this.getCommentList();
        }
    }
</script>

<style>
    .comment-list-loading {
        text-align: center;
    }
</style>