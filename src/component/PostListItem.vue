<template>
    <li class="post-item">
        <div class="post-item-author">
            <router-link :to="`/user/${author}`">
                <img :src="authorAvatarUrl" class="avatar" /><br />
                <span>{{author}}</span>
            </router-link>
        </div>
        <div class="post-item-info">
            <h3><router-link :to="`/post/${id}`">{{title}}</router-link></h3>
            <p class="post-base-info">
                发布于：{{create_time}} &nbsp; 
                浏览量：{{visit}} &nbsp; 
                赞：{{up}}
            </p>
        </div>
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
    .post-item {
        display: flex;
        margin-bottom: 20px;
        border: 1px dashed;
        border-radius: 5%;
        box-shadow: 1px 1px 1px;
    }
    .post-item-author {
        width: 100px;
        margin-right: 20px;
        text-align: center;
        padding: 5px;
    }
    .post-item-author>a:hover {
        border-bottom: 0;
    }
    .post-item-info >h3 {
        margin-top: 0;
    }
    .post-base-info {
        font-size: 14px;
        color: #7f8c8d;
    }
</style>