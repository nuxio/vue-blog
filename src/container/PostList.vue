<template>
    <div class="post-list">
        <h2>博客列表</h2>
        <p v-if="loading && !list.length">Loading</p>
        <p v-if="!loading && !list.length">还没有哦~</p>
        <ul v-if="!loading && list.length">
            <post-list-item 
                v-for="item in list" 
                :key="item.id" 
                :id="item.id"
                :title="item.title"
                :author="item.author"
                :create-at="item.create_at"
            />
        </ul>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import PostListItem from '../component/PostListItem.vue';

    export default {
        components: { PostListItem },
        data() {
            return {};
        },
        computed: {
            ...mapState({
                list: state => state.post.list,
                loading: state => state.post.loading
            }),
            ...mapActions(['requestPostList'])
        },
        mounted() {
            this.requestPostList();
        }
    }
</script>