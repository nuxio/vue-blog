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
    import Editor from '../component/Editor';
    import { post as POST, get as GET } from '../util/fetch';
    import { URL_CREATE_POST, URL_GET_POST_DETAIL } from '../store/api';

    export default {
        components: { Editor },
        data() {
            return {
                loading: false,
                title: '',
                content: '',
                tags: '',
                post_id: '',
                client_width: 0
            };
        },
        computed: {
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
                    alert('请输入标题');
                    return false;
                }
                if(!this.content) {
                    alert('请输入内容');
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
                        alert('发布成功');
                        this.$router.push(`/post/${json.blog_id}`);
                    } else {
                        alert(json.msg);
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
                        alert(json.msg);
                    }
                });
            },
            setEditorWidth() {
                window.onresize = () => {
                    this.client_width = document.body.clientWidth;
                }
            }
        },
        mounted() {
            this.post_id = this.$route.params.post_id;
            if(this.post_id) {
                this.getEditPost();
            }
            this.client_width = document.body.clientWidth;
            this.setEditorWidth();
        }
    }
</script>

<style>
    .edit-form {
        height: 100%;
    }
</style>