<template>
    <div class="flex-grow-2">
        <form @submit.prevent="create" class="edit-form">
            <h2>{{post_id ? '编辑' : '发布'}}</h2>
            <fieldset class="edit-form-field">
                <label for="edit_form_title">标题：</label>
                <input id="edit_form_title" type="text" name="title" v-model="title" required />
            </fieldset>
            <fieldset>
                <label>内容：</label>
                <editor-instance :content="pre_content" :height="300" @change="change"></editor-instance>
            </fieldset>
            <fieldset class="edit-form-field">
                <label for="edit_form_tags">标签：</label>
                <input id="edit_form_tags" type="text" v-model="tags" />
            </fieldset>
            <fieldset class="edit-form-field">
                <button type="submit">发布</button>
            </fieldset>
        </form>
    </div>
</template>

<script>
    import Editor from 'vue-html5-editor';
    import { post as POST, get as GET } from '../util/fetch';
    import { URL_CREATE_POST, URL_GET_POST_DETAIL } from '../store/api';

    const editor_options = {
        name: 'editor',
        language: 'zh-cn'
    };

    let EditorInstance = new Editor(editor_options);

    export default {
        components: { EditorInstance },
        data() {
            return {
                title: '',
                pre_content: '',
                content: '',
                tags: '',
                post_id: ''
            };
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

                let data = {
                    title: this.title,
                    content: this.content,
                    tags: this.tags.split('_')
                };

                let url = this.post_id ? (URL_GET_POST_DETAIL + this.post_id) : URL_CREATE_POST;
                
                POST(url, data)
                .then(json => {
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
                        this.pre_content = this.content = json.blog.content;
                        this.title = json.blog.title;
                        this.tags = json.blog.tags.join('_');
                    } else {
                        alert(json.msg);
                    }
                });
            }
        },
        mounted() {
            this.post_id = this.$route.params.post_id;
            if(this.post_id) {
                this.getEditPost();
            }
        }
    }
</script>

<style>
    .edit-form-field {
        margin: 10px 0;
        height: 30px;
        line-height: 30px;
    }
</style>