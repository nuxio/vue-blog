import Vue from 'vue';
import Vuex from 'vuex';

import actions from './action';
import comment from './modules/comment';
import user from './modules/user';
import user_list from './modules/user_list';
import post from './modules/post';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    actions,
    modules: {
        user,
        post,
        user_list,
        comment
    },
    strict: debug
});