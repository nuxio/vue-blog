<template>
    <transition name="toast">
        <div class="toast" v-show="show">
            <div class="toast-content">
                <i :class="['fa', icon, icon_color]" aria-hidden="true"></i>&nbsp; 
                <span v-text="message"></span>
            </div>
        </div>
    </transition>
</template>

<script>
    import './toast.css';

    export default {
        data() {
            return {
                icon_map: {
                    info: 'glyphicon fa-info-circle',
                    success: 'glyphicon fa-check-circle',
                    error: 'glyphicon fa-times-circle',
                    warn: 'glyphicon fa-exclamation-circle'
                },
                icon_color_map: {
                    info: 'c-blue',
                    success: 'c-green',
                    error: 'c-red',
                    warn: 'c-orange'
                },
                show: false,
                message: '',
                duration: 2000,
                type: 'info',
                timer: null
            }
        },
        computed: {
            icon () {
                return this.icon_map[this.type];
            },
            icon_color () {
                return this.icon_color_map[this.type];
            }
        },  
        methods: {
            startTimer() {
                this.timer = setTimeout(this.close, this.duration);
            },
            close() {
                this.show = false;
                this.$el.addEventListener('animationend', this.destroy)
            },
            destroy() {
                this.$el.removeEventListener('animationend', this.destroy)
                this.$el.parentNode.removeChild(this.$el);
            }
        },
        mounted() {
            this.startTimer();
        }
    }
</script>