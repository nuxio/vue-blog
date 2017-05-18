<template>
<div>
    <a href="javascript:;" v-for="p in list" @click="turn(p)">{{p}}</a>
</div>
</template>

<script>
    export default {
        props: {
            page: {
                type: Number,
                required: true
            },
            total_num: {
                type: Number,
                required: true
            },
            total_page: {
                type: Number,
                required: true
            }
            
        },
        data() {
            return {};
        },
        computed: {
            list() {
                let r = [];
                for(let i = 1; i <= this.total_page; i++) {
                    r.push(i);
                }
                return r;
            }
        },
        methods: {
            turn(page) {
                this.$emit('turn', page);
            }
        }
    };
</script>