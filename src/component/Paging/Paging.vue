<template>
    <ul class="paging">
        <li v-for="(p, index) in list" @click="turn(p, index)" :class="['page-item',  (index + 1) == page ? 'page-item-active' : '']">
            {{p}}
        </li>
    </ul>
</template>

<script>
    import './paging.css';

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
            turn(page, index) {
                if((index + 1) == page) return false;
                this.$emit('turn', page);
            }
        }
    };
</script>