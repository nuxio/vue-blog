<template>
    <li>
        <h3><router-link :to="`/blog/${id}`">{{title}}</router-link></h3>
        <p>Create by:{{author}}, create at: {{create_time}}</p>
    </li>
</template>

<script>
    import moment from 'moment';

    export default {
        name: 'post-list-item',
        props: {
            id: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            author: {
                type: String,
                required: true
            },
            authorAvatarUrl: {
                type: String
            },
            createAt: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                create_time: ''
            };
        },
        mounted() {
            this.create_time = moment(this.createAt).fromNow();
        }
    }
</script>