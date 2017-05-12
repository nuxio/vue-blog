<script>
    import { mapState } from 'vuex';
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
            })
        },
        render(h) {
            return (
                    <div class="post-list">
                        <h2>博客列表</h2>
                        {
                            this.loading 
                            ? 
                            <p>Loading</p> 
                            : 
                            (
                                this.list.length 
                                ? 
                                <ul>
                                    {this.list.map(item => {
                                        console.log(item);
                                        return <PostListItem key={item.id} {...item} />})}
                                </ul>
                                :
                                <p>还没有哦~</p>
                            )
                        }
                    </div>
            );
        }
    }
</script>