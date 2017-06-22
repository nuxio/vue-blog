<template>
    <div>
        <div class="comment-box-wrap">
            <h3 class="sub-title comment-box-title">评论列表：</h3>
            <div class="comment-list-wrap">
                <p v-if="loading" class="text-center">评论加载中...</p>
                <p v-if="!loading && !list.length" class="text-center">暂无评论</p>
                <ul v-if="!loading && list.length" class="comment-list">
                    <comment-item 
                        v-for="(c, index) in list" 
                        :key="c._id"
                        :id="c._id"
                        :index="index"
                        :author="c.author"
                        :reply-to="c.reply_to"
                        :reply-who="c.reply_who"
                        :create-at="c.create_at"
                        :content="c.content"
                        :ups="c.ups"
                        :marked="marked"
                        :submit-comment="submitComment"
                        :view-conversation="viewConversation"
                        :loading-submit="loading_submit"
                        :post-id="postId"
                    ></comment-item>
                </ul>
            </div>
        </div>
        <div class="comment-box-wrap">
            <h3 class="sub-title comment-box-title">我有话说：</h3>
            <div class="comment-editor-wrap">
                <template v-if="is_login">
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
        
        <modal v-model="show_conversation" title="查看对话">
            <div class="comment-list-wrap">
                <ul class="comment-list">
                    <comment-item 
                        v-for="(c, index) in conversation_list" 
                        :key="c._id"
                        :id="c._id"
                        :index="index"
                        :author="c.author"
                        :reply-to="c.reply_to"
                        :reply-who="c.reply_who"
                        :create-at="c.create_at"
                        :content="c.content"
                        :ups="c.ups"
                        :marked="marked"
                        :submit-comment="submitComment"
                        :view-conversation="viewConversation"
                        :loading-submit="loading_submit"
                        :post-id="postId"
                        :is-conversation="1"
                    ></comment-item>
                </ul>
            </div>
        </modal>
    </div>
</template>

<script>
    import { mapMutations, mapState } from 'vuex';
    import { RECEIVE_COMMENT_LIST } from '../../store/mutation-types';
    import { URL_GET_COMMENT_LIST, URL_SUBMIT_COMMENT } from '../../store/api';
    import { get as GET, post as POST } from '../../util/fetch';
    import Toast from '../../component/Toast';
    import Dialog from '../../component/Dialog';
    import Editor from '../../component/Editor';
    import Modal from '../../component/Modal';
    import CommentItem from './CommentItem.vue';
    
    export default {
        components: { Editor, CommentItem, Modal },
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
                loading_vote: false,
                show_conversation: false,
                conversation_list: []
            };
        },
        computed: {
            ...mapState({
                is_login: state => state.user.is_login,
                list(state) {
                    return state.comment.count ? (state.comment.id_map[this.postId] || []) : [];
                }
            }),
            id_map() {
                let map = {};
                for(let i = 0, length = this.list.length; i < length; i++) {
                    !map[this.list[i]._id] && (map[this.list[i]._id] = this.list[i]);
                }
                return map;
            }
        },
        methods: {
            ...mapMutations([ RECEIVE_COMMENT_LIST ]),
            submitComment(content, comment_id) {
                let data = {};
                if(typeof content === 'string') {
                    data.content = content.trim();
                    data.reply_to = comment_id;
                } else {
                    data.content = this.content.trim();
                } 
                
                if(!data.content) {
                    this.$alert('请输入评论内容');
                    return false;
                }

                this.loading_submit = true;

                POST(URL_SUBMIT_COMMENT.replace(':post_id', this.postId), data)
                .then(json => {
                    this.loading_submit = false;
                    if(json.msg === 'ok') {
                        this.$toast.success('评论成功');
                        this.content = '';
                        this.getCommentList();
                    } else {
                        this.$alert(json.msg);
                    }
                });
            },
            getCommentList() {
                this.loading = true;
                GET(URL_GET_COMMENT_LIST.replace(':post_id', this.postId))
                .then(json => {
                    this.loading = false;

                    if(json.msg === 'ok') {
                        let comments = json.comments.map(c => {
                            let tmp = Object.assign({}, c, { hover: false, show_reply: false, reply_content: '' });
                            return tmp;
                        });
                        this[RECEIVE_COMMENT_LIST]({post_id: this.postId, comments});
                    } else {
                        this.$alert(json.msg);
                    }
                });
            },
            viewConversation(id) {
                let arr = [];
                let tmp_comment = this.id_map[id];

                if(!tmp_comment) return false;

                let tmp_reply_to = tmp_comment.reply_to;
                arr.unshift(tmp_comment);

                while(id) {
                    let id_in = id;
                    for(let i = 0, l = this.list.length; i < l; i++) {
                        let c = this.list[i];
                        // 这条评论是不是回复的此评论，且回复的人要是此评论回复的评论的作者
                        if(c.reply_to == id && c.author.username == tmp_comment.reply_who.username) {
                            arr.push(c);
                            id = c._id;
                        }
                    }

                    if(id_in === id) {
                        id = '';
                    }
                }

                while(tmp_reply_to) {
                    tmp_comment = this.id_map[tmp_reply_to];
                    if(tmp_comment) {
                        arr.unshift(tmp_comment);
                        tmp_reply_to = tmp_comment.reply_to;
                    } else {
                        tmp_reply_to = '';
                    }
                }

                this.conversation_list = arr;
                this.show_conversation = true;
            }
        },
        mounted() {
            this.getCommentList();
        }
    }
</script>

<style>
.comment-box-wrap {
    border: 1px solid #e7eaf2;
    box-shadow: 0 1px 3px 0 rgba(0,33,77,.05);
    background: #fff;
    margin-top: 12px;
    overflow: visible;
    border-radius: 4px;
}
.comment-box-title {
    border-bottom: 1px solid #f0f2f7;
    margin: 0;
    padding: 10px;
}
.comment-list-wrap, .comment-editor-wrap {
    padding: 20px;
}
</style>
