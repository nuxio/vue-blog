<template>
    <li>
        <h3><router-link :to="`/post/${id}`">{{title}}</router-link></h3>
        <p class="post-base-info">
            作者：<router-link :to="`/user/${author}`">{{author}}</router-link> &nbsp; 
            发布于：{{create_time}} &nbsp; 
            浏览量：{{visit}} &nbsp; 
            赞：{{up}}
        </p>
    </li>
</template>

<script>
    import moment from 'moment';
    import { mapState } from 'vuex';

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
            },
            visit: {
                type: Number
            },
            up: {
                type: Number
            }
        },
        data() {
            return {
                create_time: ''
            };
        },
        mounted() {
            this.create_time = moment(parseInt(this.createAt, 10)).fromNow();
        }
    }
</script>

<style>
    .post-base-info {
        font-size: 14px;
        color: #7f8c8d;
    }
</style>