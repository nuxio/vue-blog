<template>
    <div class="flex-grow-2">
        <h2>{{ $route.params.username }}</h2>
        <div class="user-profile">
            <p><img :src="user.avatar_url || '../assets/default_avatar.jpg'" /></p>
            <p>{{user.email}}</p>
        </div>
    </div>
</template>

<script>
    import { mapState, mapMutations } from 'vuex';
    import { get as GET } from '../util/fetch';
    import { URL_USER_INFO } from '../store/api';
    import { GET_USER_INFO } from '../store/mutation-types';

    export default {
        data() {
            return {};
        },
        computed: {
            ...mapState({
                user(state) {
                    return state.user.user_list[this.$route.params.username];
                }
            })
        },
        methods: {
            ...mapMutations([GET_USER_INFO]),
            queryUserInfo() {
                GET(URL_USER_INFO.replace(':username', this.$route.params.username))
                .then(json => {
                    if(json.msg === 'ok') {
                        this[GET_USER_INFO]({user: json.user});
                    } else {
                        alert(json.msg);
                    }
                })
            }
        },
        mounted() {
            if(!this.user) {
                this.queryUserInfo();
            }
        }
    }
</script>