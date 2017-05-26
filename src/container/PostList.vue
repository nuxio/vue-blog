<template>
    <div class="flex-grow-2">
        <div class="post-list pannel">
            <div v-if="loading && !list.length">加载中...</div>
            <div v-if="!loading && !list.length">还没有哦~</div>
            <ul v-if="!loading && list.length">
                <post-list-item 
                    v-for="item in list" 
                    :key="item._id" 
                    :id="item._id"
                    :title="item.title"
                    :author="item.author"
                    :create-at="item.create_at"
                    :visit="item.visit"
                    :up="item.up"
                />
            </ul>
            <paging :page="page" :total_num="total_num" :total_page="total_page" v-on:turn="requestPostList" v-if="!loading && list.length"></paging>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    import PostListItem from '../component/PostListItem.vue';
    import Paging from '../component/Paging.vue';

    export default {
        components: { PostListItem, Paging },
        data() {
            return {};
        },
        computed: {
            ...mapState({
                loading: state => state.post.loading,
                page: state => state.post.page,
                limit: state => state.post.limit,
                list: state => state.post.list,
                total_num: state => state.post.total_num
            }),
            ...mapGetters(['total_page'])
        },
        methods: {
            ...mapActions(['requestPostList'])
        },
        mounted() {
            this.requestPostList({page: this.page});
        }
    }
</script>

<style>
    .post-list {
        height: 100%;
        position: relative;
    }
</style>