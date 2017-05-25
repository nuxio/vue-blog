<template>
    <div class="flex-grow-2">
        <div class="post-list">
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
            <paging :page="page" :total_num="total_num" :total_page="total_page" v-on:turn="requestPostList"></paging>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions, mapGetters } from 'vuex';
    import PostListItem from '../component/PostListItem.vue';
    import { REQUEST_POST_LIST, RECEIVE_POST_LIST } from '../store/mutation-types';
    import { URL_GET_POST_LIST } from '../store/api';
    import { get as GET } from '../util/fetch';
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
            requestPostList(page) {
                if(this.loading) return false;

                this.$store.commit({type: REQUEST_POST_LIST, page});

                GET(URL_GET_POST_LIST, {page, limit: this.limit})
                .then(json => {
                    if(json.msg === 'ok') {
                        this.$store.commit({
                            type: RECEIVE_POST_LIST, 
                            list: json.blogs, 
                            page: json.page, 
                            total_num: json.total_num
                        });
                    } else {
                        alert(json.msg);
                        this.$store.commit({type: RECEIVE_POST_LIST, list: []});
                    }
                });
            }
        },
        mounted() {
            this.requestPostList(1);
        }
    }
</script>

<style>
    .post-list {
        margin-top: 20px;
    }
</style>