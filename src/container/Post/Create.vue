<template>
    <div class="flex-grow-2">
        <form @submit.prevent="create" class="edit-form pannel">
            <h2>{{post_id ? '编辑' : '发布'}}</h2>
            <fieldset class="edit-form-field">
                <label for="edit_form_title">标题：</label>
                <input id="edit_form_title" type="text" name="title" v-model="title" required />
            </fieldset>
            <fieldset>
                <label>内容：</label>
                <editor 
                    v-model="content"
                    height="350px"
                    :width="editor_width" 
                    @save-draft="saveDraft"
                ></editor>
            </fieldset>
            <fieldset class="edit-form-field">
                <label for="edit_form_tags">标签：</label>
                <input id="edit_form_tags" type="text" v-model="tags" />
            </fieldset>
            <fieldset class="edit-form-field">
                <label>&nbsp;</label>
                <button type="submit" :disabled="loading" class="btn btn-primary">{{loading ? '发布中...' : '发布'}}</button>
            </fieldset>
        </form>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import Editor from '../../component/Editor';
    import Toast from '../../component/Toast';
    import Dialog from '../../component/Dialog';
    import { post as POST, get as GET } from '../../util/fetch';
    import { URL_CREATE_POST, URL_GET_POST_DETAIL } from '../../store/api';

    export default {
        components: { Editor },
        data() {
            return {
                loading: false,
                title: '',
                content: '',
                tags: '',
                post_id: '',
                client_width: 0,
                /**
                 * 草稿版本名称
                 * 草稿保存在localStorage，数据结构如下：
                 * 'DRAFTS_OF_' + username: {
                 *    'DRAFT_' + Math.random() : {
                 *        title: 'xxx',
                 *        content: 'xxx',
                 *        tags: 'xxx',
                 *        save_time: 'xxx'
                 *    }
                 * }
                 * 编辑器初始化时初始化草稿名称
                 * 如果编辑的就是草稿，则沿用草稿名称
                 * 点击保存的时候删除草稿
                 **/
                draft_name: '',
                draft_id: ''
            };
        },
        computed: {
            ...mapState({
                username: (state) => state.user.user_info.username
            }),
            editor_width() {
                return this.client_width > 768 ? '75%' : '100%';
            }
        },
        methods: {
            change(c) {
                this.content = c; 
            },
            create() {
                this.title = this.title.trim();
                this.content = this.content.trim();

                if(!this.title) {
                    this.$toast.warn('请输入标题');
                    return false;
                }
                if(!this.content) {
                    this.$toast.warn('请输入内容');
                    return false;
                }

                this.loading = true;

                let data = {
                    title: this.title,
                    content: this.content,
                    tags: this.tags.split('_')
                };

                let url = this.post_id ? (URL_GET_POST_DETAIL + this.post_id) : URL_CREATE_POST;
                
                POST(url, data)
                .then(json => {
                    this.loading = false;

                    if(json.msg === 'ok') {
                        this.$toast.success('发布成功');
                        this.draft_id && this.deleteDraft();
                        this.$router.push(`/post/${json.blog_id}`);
                    } else {
                        this.$alert(json.msg);
                    }
                });
            },
            getEditPost() {
                GET(URL_GET_POST_DETAIL + this.post_id)
                .then(json => {
                    if(json.msg === 'ok') {
                        this.content = json.blog.content;
                        this.title = json.blog.title;
                        this.tags = json.blog.tags.join('_');
                    } else {
                        this.$alert(json.msg);
                    }
                });
            },
            setEditorWidth() {
                window.onresize = () => {
                    this.client_width = document.body.clientWidth;
                }
            },
            getDraft() {
                let drafts = JSON.parse(window.localStorage.getItem(this.draft_name));
                if(drafts && drafts[this.draft_id]) {
                    let draft = drafts[this.draft_id];
                    this.title = draft.title;
                    this.content = draft.content;
                    this.tags = draft.tags;
                } else {
                    console.log(1);
                    this.$alert('不存在的草稿哦~');
                }
            },
            saveDraft() {
                if(!this.username) return false;
                let drafts = JSON.parse(window.localStorage.getItem(this.draft_name)) || {};
                this.draft_id = this.draft_id || 'DRAFT_' + parseInt(Math.random() * 10000000, 10);
                drafts[this.draft_id] = {
                    title: this.title,
                    content: this.content,
                    tags: this.tags,
                    save_time: new Date().getTime()
                };
                
                window.localStorage.setItem(this.draft_name, JSON.stringify(drafts));
                this.$toast.success('草稿已保存');
            },
            deleteDraft() {
                let drafts = JSON.parse(window.localStorage.getItem(this.draft_name)) || {};
                delete drafts[this.draft_id];
                window.localStorage.setItem(this.draft_name, JSON.stringify(drafts));
            }
        },
        mounted() {
            let id = this.$route.params.post_id;

            this.draft_name = `DRAFTS_OF_${this.username}`;
            this.client_width = document.body.clientWidth;
            this.setEditorWidth();

            if(id && id.indexOf('DRAFT_') > -1) {
                this.draft_id = id;
                this.getDraft();
            } else if(id) {
                this.post_id = id;
                this.getEditPost();
            }
        }
    }
</script>

<style>
.edit-form {
    height: 100%;
}
</style>
