<template>
    <div class="comment-list">
        <h5>评论列表：</h5>
        <p v-if="loading" class="comment-list-loading">Loading</p>
        <p v-if="!loading && !list.length">暂无评论</p>
        <ul v-if="!loading && list.length">
            <li v-for="c in list">
                {{c.content}} --- {{c.author}}
            </li>
        </ul>
        <template v-if="is_login">
            <h5>添加评论</h5>
            <form @submit.prevent="submitComment">
                <textarea cols="30" rows="10" v-model="content" required></textarea>
                <button type="submit">提交</button>
            </form>
        </template>
        <div v-else>
            您还未登录，<router-link to="/login">去登录</router-link>
        </div>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { RECEIVE_COMMENT_LIST } from '../store/mutation-types';
    import { URL_GET_COMMENT_LIST, URL_SUBMIT_COMMENT } from '../store/api';
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
                content: ''
            };
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login,
                list(state) {
                    return state.comment.count ? (state.comment.id_map[this.postId] || []) : [];
                }
            })
        },
        methods: {
            ...mapMutations([RECEIVE_COMMENT_LIST]),
            submitComment() {
                this.content = this.content.trim();
                if(!this.content) {
                    alert('请输入评论内容');
                    return false;
                }

                let data = {
                    content: this.content
                };

                POST(URL_SUBMIT_COMMENT.replace(':post_id', this.postId), data)
                .then(json => {
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