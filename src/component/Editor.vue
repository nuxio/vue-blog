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
            </ul>
        </div>
        <div class="editor-input-wrap" v-show="!view">
            <textarea class="editor-input" v-model="content" ref="input" @keydown="watchInput"></textarea>
        </div>
        <div class="editor-preview-wrap markdown-body" v-if="view">
            <div v-html="content_preview"></div>
        </div>
    </div>
</template>

<script>
    import marked from 'marked';
    import range from '../util/range';

    import('../util/highlight.min.js').then(hljs => { 
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
                type: Number,
                default: 300
            },
            width: {
                type: Number,
                default: 500
            },
            display: {
                type: String,
                default: 'inline-block'
            }
        },
        data() {
            return {
                expanded: false,
                view: false,
                content: '',
                content_preview: ''
            };
        },
        computed: {
            box_style_object() {
                return this.expanded 
                    ? 
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
                        height: this.height + 'px',
                        width: this.width + 'px',
                        display: this.display
                    };
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
            },
            watchInput(e) {
                if(e.keyCode === 9) {
                    e.preventDefault();
                    this.insertContent('    ');
                    return false;
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
            }
        }
    }
</script>

<style>
    @import "../assets/github-markdown.css";
    @import "../assets/atom-one-light.css";
    
    
    .editor-box {
        vertical-align: top;
        border: 1px solid #eee;
        box-shadow: 1px 1px #eee;
    }
    .editor-nav-wrap {
        height: 35px;
        width: 100%;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }
    .editor-nav {
        height: 100%;
        padding: 0 10px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .editor-nav-item {
        height: 25px;
        width: 25px;
        text-align: center;
        cursor: pointer;
    }
    .editor-nav-item:hover {
        background-color: #eee;
    }
    .editor-input-wrap {
        padding: 10px;
        background-color: #333;
        height: calc(100% - 55px);
    }
    .editor-input {
        resize: none;
        height: 100%;
        width: 100%;
        color: #fff;
        font-family: 'sans-serif';
        font-size: 16px;
        outline: none;
        background-color: transparent;
        border: 0;
    }
    .editor-preview-wrap {
        background-color: #fff;
        overflow: auto;
        height: calc(100% - 55px);
    }
</style>