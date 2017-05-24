<template>
    <ul class="paging">
        <li v-for="(p, index) in list" @click="turn(p)" :class="['page-item',  (index + 1) == page ? 'page-item-active' : '']">
            {{p}}
        </li>
    </ul>
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

<style>
    .paging {
        width: 100%;
        display: flex;
        height: 50px;
        align-items: center;
        border: 1px dashed #eee;
        border-radius: 5px;
        flex-wrap: wrap;
    }
    .page-item {
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        cursor: pointer;
        margin-right: 10px;
        border-radius: 3px;
    }
    .page-item:hover, .page-item-active {
        background-color: #42b983;
        color: #fff;
    }
</style>