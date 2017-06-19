<template>
    <div class="modal-wrap">
        <div class="modal-backdrop" v-show="show"></div>
        <div class="modal-dialog" 
            :style="{left: left + 'px', top: top + 'px', width: width + 'px'}">
            <div class="modal-header">
                <button type="button" class="btn btn-primary close" @click="close" v-if="showClose">
                    <span>×</span>
                </button>
                <h4 class="modal-title" v-text="title"></h4>
            </div>
            <div class="modal-body">
                <div style="font-size:16px;">
                    <div v-html="message" v-if="isHtml"></div>
                    <div v-else>
                        <i :class="['fa', icon, icon_color]" aria-hidden="true"></i>&nbsp; 
                        <span v-text="message"></span>
                    </div>
                </div>
            </div>
            <div class="modal-footer text-center">
                <button @click="confirm" type="button" class="btn btn-primary" v-text="btnConfirmText"></button>
                <button @click="cancel" v-if="showCancel" type="button" class="btn btn-default" v-text="btnCancelText"></button>
            </div>
        </div>
    </div>
</template>

<script>
    
    import './dialog.css';

    export default {
        data() {
            return {
                icon_map: {
                    info: 'glyphicon fa-info-circle',
                    confirm: 'glyphicon fa-question-circle',
                    success: 'glyphicon fa-check-circle',
                    error: 'glyphicon fa-times-circle',
                    warn: 'glyphicon fa-exclamation-circle'
                },
                icon_color_map: {
                    info: 'c-blue',
                    confirm: 'c-blue',
                    success: 'c-green',
                    error: 'c-red',
                    warn: 'c-orange'
                },
                show: false,
                showClose: true,
                title: '提示',
                type: 'info',
                message: '',
                isHtml: false,
                btnConfirmText: '确定',
                btnCancelText: '取消',
                left: 0,
                top: 0,
                width: 480,
                dtype: 'alert' // 对话框类型，alert/confirm/prompt(todo)
            };
        },
        watch: {
            show (n, v) {
                if(n) {
                    this.$nextTick(() => {
                        this.top = (window.innerHeight - this.$el.children[0].offsetHeight) / 2;
                        this.top = this.top < 100 ? 100 : this.top;
                        this.top = this.top > 300 ? 300 : this.top;
                        this.left = (window.innerWidth  - this.width) / 2;
                    });
                }
            }
        },
        computed: {
            icon () {
                return this.icon_map[this.type];
            },
            icon_color () {
                return this.icon_color_map[this.type];
            },
            showCancel() {
                return this.dtype === 'confirm';
            }
        },  
        methods: {
            confirm() {
                this.onConfirm && typeof this.onConfirm === 'function' && this.onConfirm();
                this.close();
            },

            cancel() {
                this.onCancel && typeof this.onCancel === 'function' && this.onCancel();
                this.close();
            },

            close() {
                this.show = false;
                this.$el.parentNode.removeChild(this.$el);
            }
        }
    }
</script>