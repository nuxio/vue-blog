<template>
    <div class="create">
        <form @submit.prevent="create" class="edit-form">
            <p>title: <input type="text" name="title" v-model="title" required /></p>
            <editor-instance :content="pre_content" :height="300" @change="change"></editor-instance>
            <button type="submit">发布</button>
        </form>
    </div>
</template>

<script>
    import Editor from 'vue-html5-editor';
    import { post as POST } from '../util/fetch';
    import { URL_CREATE_POST } from '../store/api';

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
                tags: ''
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

                POST(URL_CREATE_POST, data)
                .then(json => {
                    if(json.msg === 'ok') {
                        alert('发布成功');
                        this.$router.push(`/post/${json.blog_id}`);
                    } else {
                        alert(json.msg);
                    }
                });
            }
        }
    }
</script>

<style>
    .edit-form {
        width: 600px;
    }
</style>