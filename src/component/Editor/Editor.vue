<template>
    <div class="editor-box" :style="box_style_object">
        <div class="editor-nav-wrap">
            <ul class="editor-nav">
                <li class="editor-nav-item" title="全屏编辑" @click="expand">
                    <i class="fa fa-arrows-alt" aria-hidden="true"></i>
                </li>
                <li class="editor-nav-item" title="预览" @click="preview">
                    <i class="fa fa-eye" aria-hidden="true"></i>
                </li>
                <li class="editor-nav-item" title="上传图片" @click="triggerUpload">
                    <i class="fa fa-cloud-upload" aria-hidden="true"></i>
                </li>
            </ul>
        </div>
        <div class="editor-input-wrap" v-show="!view">
            <div class="editor-placeholder" v-text="placeholder" v-show="show_placeholder"></div>
            <textarea class="editor-input" v-model="content" ref="input" @keydown="watchInput"></textarea>
        </div>
        <div class="editor-preview-wrap markdown-body" v-if="view">
            <div v-html="content_preview"></div>
        </div>

        <input type="file" ref="upload" class="editor-file-input" @change="upload" />
    </div>
</template>

<script>
    import './editor.css';

    import marked from 'marked';
    import { upload as UPLOAD } from '../../util/fetch';
    import { URL_USER_UPLOAD_POST_IMG } from '../../store/api';
    import range from '../../util/range';

    import('../../util/highlight.min.js').then(hljs => { 
        marked.setOptions({
            sanitize: true,
            highlight: function (code) {
                return hljs.highlightAuto(code).value;
            }
        });
    });
    
    export default {
        name: 'vue-editor',
        props: {
            value: {
                type: String
            },
            height: {
                default: 300
            },
            width: {
                default: 500
            },
            display: {
                type: String,
                default: 'inline-block'
            },
            placeholder: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                expanded: false,
                view: false,
                content: '',
                content_preview: '',
                inner_draft_name: ''
            };
        },
        computed: {
            box_style_object() {
                return this.expanded ? 
                    {
                        display: 'block',
                        position: 'fixed',
                        height: '100%',
                        width: '100%',
                        top: 0,
                        left: 0
                    } 
                    : 
                    {
                        height: this.height,
                        width: this.width,
                        display: this.display
                    };
            },
            show_placeholder() {
                return this.content.length === 0;
            }
        },
        watch: {
            content () {
                this.$emit('input', this.content);
            },
            value (nv) {
                this.content = nv;
            }
        },
        methods: {
            insertContent(content) {
                let textarea = this.$refs.input;
                let value = textarea.value;
                let point = range.getCursorPosition(textarea);
                let lastChart = value.substring(point - 1, point);
                let lastFourCharts = value.substring(point - 4, point);
                if (lastChart != '\n' && value != '' && lastFourCharts != '    ') {
                    content = '\n' + content;
                    range.insertAfterCursor(textarea, content);
                } else {
                    range.insertAfterCursor(textarea, content);
                }
                this.$refs.input.focus();
                this.content = this.$refs.input.value;
            },
            watchInput(e) {
                if(e.keyCode === 9) {
                    e.preventDefault();
                    this.insertContent('    ');
                    return false;
                }
                // ctrl+s 保存草稿
                if(e.ctrlKey && e.keyCode === 83) {
                    e.preventDefault();
                    this.$emit('save-draft');
                }
            },
            expand() {
                this.expanded = !this.expanded;
            },
            preview() {
                this.view = !this.view;
                if(this.view) {
                    this.content_preview = marked(this.content);
                }
            },
            triggerUpload() {
                this.$refs.upload.click();
            },
            // 上传图片
            upload(e) {
                if(!e.target.value) {
                    return false;
                }
                let formData = new FormData();
                formData.append('img', e.target.files[0]);

                this.uploading = true;

                UPLOAD({ url: URL_USER_UPLOAD_POST_IMG, formData })
                .then(json => {
                    this.uploading = false;
                    if(json.msg === 'ok') {
                        this.insertContent(`![](${json.url})`);
                    } else {
                        alert(json.msg);
                    }
                    this.$refs.upload.value = '';
                });
            }
        }
    }
</script>