<template>
<div class="modal-wrap" :style="{display: show ? 'block' : 'none'}">
    <div class="modal-dialog" :style="{ width: width + 'px', 'margin': '30px auto', 'position': 'relative'}">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" v-if="showClose" class="btn btn-primary close" @click="close">
                    <span>×</span>
                </button>
                <h4 class="modal-title" v-text="title"></h4>
            </div>
            <div class="form-horizontal roll" :style="{'max-height': maxHeight + 'px'}">
                <div class="modal-body">
                    <slot>THIS IS MODAL BODY AREA.</slot>
                </div>
                <div class="modal-footer" v-if="hasFooter" ref="footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>
    </div>
    <div :class="['modal-backdrop', 'fade', show ? 'in' : '']" @click.self="close"></div>
</div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '提示'
            },
            width: {
                type: Number,
                default: 970
            },
            maxHeight: {
                type: Number,
                default: 700
            },
            value: {
                type: Boolean,
                required: true
            },
            showClose: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                show: false,
                inClass: '',
                hasFooter: true  // 是否有传递footer这个slot
            }
        },
        watch: {
            value(n) {
                this.show = n;
            },
            show(n) {
                this.$emit('input', n);
                this.$emit(n ? 'open' : 'close');
            }
        },
        mounted() {
            if(!this.$refs.footer.childElementCount) {
                this.hasFooter = false;
            }
        },
        methods: {
            close() {
                this.show = false;
            },
            show() {
                this.show = true;
            }
        }
    };
</script>