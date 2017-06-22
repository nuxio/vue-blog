<template>
<li class="comment-item" @mouseenter="showMoreBtn" @mouseleave="hideMoreBtn">
    <div class="comment-item-user">
        <router-link :to="`/user/${author.username}`">
            <img :src="author.avatar_url" />
            <br />
            {{author.username}}
        </router-link>
    </div>
    <div class="comment-item-content-box">
        <div class="comment-item-info">
            <span>{{index+1}}楼 · <span v-if="replyTo">回复{{replyWho.username}}于</span>{{create_time}} &nbsp;</span>
            <button v-if="replyTo && !isConversation" class="btn-normal" @click="viewConversation(id)">
                <i class="fa fa-comments-o" aria-hidden="true"></i> 查看对话 
            </button>
            <button class="btn-normal" @click="vote">
                <i :class="['fa', is_voted ? 'fa-thumbs-up' : 'fa-thumbs-o-up']" aria-hidden="true"></i> 赞（{{up_count}}）
            </button>
            &nbsp;
            <button class="btn-normal" v-show="is_login && hover && !isConversation" @click="showReply">
                <i class="fa fa-reply" aria-hidden="true"></i> 回复
            </button>
            &nbsp;
            <button class="btn-normal" v-show="is_login && author.username === user_info.username && hover" @click="deleteComment">
                <i class="fa fa-trash-o" aria-hidden="true"></i> 删除
            </button>
            &nbsp;
        </div>
        <div class="comment-item-content markdown-body" v-html="marked(content)"></div>
        <div v-if="show_reply" class="comment-reply-box">
            <form @submit.prevent="submitComment(reply_content, id)">
                <editor v-model="reply_content" height="200px" width="100%" display="block" :placeholder="`回复${author.username}`"></editor>
                <br />
                <button type="submit" :disabled="loadingSubmit" class="btn btn-primary">{{loadingSubmit ? '提交中...' : '提交'}}</button>
                <button type="button" class="btn btn-default" @click="hideReply">取消</button>
            </form>
        </div>
    </div>
</li>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import moment from 'moment';
import Dialog from '../../component/Dialog';
import Toast from '../../component/Toast';
import Editor from '../../component/Editor';
import { COMMENT_DELETE } from '../../store/mutation-types';
import { URL_COMMENT_VOTE, URL_COMMENT_DELETE } from '../../store/api';
import { post as POST } from '../../util/fetch';

export default {
    components: { Editor },
    props: {
        postId: {
            type: String,
            required: true
        },
        id: {
            type: String,
            required: true
        },
        index: {
            type: Number,
            required: true
        },
        author: {
            type: Object,
            required: true,
            default() {
                return {
                    username: '',
                    avatar_url: ''
                };
            }
        },
        replyTo: {
            type: String,
            default: ''
        },
        replyWho: {
            type: Object,
            default() {
                return {
                    username: ''
                };
            }
        },
        createAt: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        ups: {
            type: Array,
            default() {
                return [];
            }
        },
        loadingSubmit: {
            type: Boolean,
            default: false
        },
        marked: {
            type: Function,
            required: true
        },
        submitComment: {
            type: Function,
            required: true
        },
        viewConversation: {
            type: Function,
            required: true
        },
        isConversation: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            hover: false,
            show_reply: false,
            loading_vote: true,
            reply_content: '',
            is_voted: false,
            up_count: 0
        }
    },
    computed: {
        ...mapState({
            is_login: state => state.user.is_login,
            user_info: state => state.user.user_info
        }),
        create_time() {
            return moment(parseInt(this.createAt, 10)).fromNow();
        }
    },
    methods: {
        ...mapMutations([ COMMENT_DELETE ]),
        showMoreBtn() {
            this.hover = true;
        },
        hideMoreBtn() {
            this.hover = false;
        },
        showReply() {
            this.show_reply = true;
        },
        hideReply() {
            this.show_reply = false;
        },
        vote() {
            if(!this.is_login) {
                this.$alert('您还未登录，请先登录');
                return false;
            }

            this.loading_vote = true;

            POST(URL_COMMENT_VOTE.replace(':comment_id', this.id))
            .then(json => {
                this.loading_vote = false;

                if(json.msg === 'ok') {
                    let payload = {
                        post_id: this.postId,
                        index: this.index,
                        user: {
                            username: this.user_info.username,
                            avatar_url: this.user_info.avatar_url
                        }
                    };
                    if(json.action === 'up') {
                        this.is_voted = true;
                        this.up_count++;
                    } else {
                        this.is_voted = false;
                        this.up_count--;
                    }
                } else {
                    this.$alert(json.msg);
                }
            });
        },
        deleteComment() {
            this.$confirm('确定删除此条评论？', () => {
                POST(URL_COMMENT_DELETE, {comment_id: this.id})
                .then(json => {
                    if(json.msg === 'ok') {
                        this.$toast.success('删除成功');
                        this[COMMENT_DELETE]({post_id: this.postId, comment_id: this.id});
                    } else {
                        $this.$alert(json.msg);
                    }
                });
            });
        },
        checkVoted() {
            this.up_count = this.ups.length;

            if(!this.is_login) { return false; }

            let index = -1;
            for(let i = 0; i < this.up_count; i++) {
                if(this.ups[i].username === this.user_info.username) {
                    index = i;
                    break;
                }
            }
            index !== -1 && (this.is_voted = true);
        }
    },
    mounted() {
        this.checkVoted();
    }
}
</script>

<style>
.comment-item {
    display: flex;
    margin-bottom: 15px;
    border-bottom: 1px solid #e5e5e5;
}
.comment-item-content-box {
    width: 100%;
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
.comment-reply-box {
    margin-bottom: 10px;
}
</style>