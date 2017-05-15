<template>
    <div class="post-detail">
        <p v-if="post.loading">Loading</p>
        <p v-if="!post.loading && post.msg">{{post.msg}}</p>
        <div v-else="!post.loading">
            <h2>{{post.title}}</h2>
            <div>{{post.content}}</div>
        </div>
        <div>
            comments: <span v-if="comments_loading">Loading...</span>
            <span v-for="c in comments">{{c.content}}</span>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapState } from 'vuex';
    
    export default {
        data() {
            return {};
        },
        computed: {
            ...mapState({
                post(state) {
                    // vue，只能监听简单数据类型的变化，所以这里强行扯上loading属性，只要这个有变化，就重新计算这里的post
                    return state.post.id_map.loading ? {loading: true} : (state.post.id_map[this.$route.params.post_id] || {loading: true});
                },
                comments_loading(state) {
                    return state.comment.loading;
                },
                comments(state) {
                    return state.comment.loading ? [] : (state.comment.id_map[this.$route.params.post_id] || []);
                }
            })
        },
        methods: {
            ...mapActions(['requestPostDetail', 'requestCommentList'])
        },
        mounted() {
            let post_id = this.$route.params.post_id;

            this.requestPostDetail(post_id);
            this.requestCommentList(post_id)
        }
    }
</script>