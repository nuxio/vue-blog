import Vue from 'vue';
import Vuex from 'vuex';

import comment from './modules/comment';
import user from './modules/user';
import post from './modules/post';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    modules: {
        user,
        post,
        comment
    },
    strict: debug
});