import { REQUEST_COMMENT_LIST, RECEIVE_COMMENT_LIST } from '../mutation-types';
import { get as GET } from '../../util/fetch';
import { URL_GET_COMMENT_LIST } from '../api';

export default {
    state: {
        loading: false,
        id_map: {}
    },
    mutations: {
        [REQUEST_COMMENT_LIST] (state, payload) {
            state.loading = true;
            state.id_map[payload.post_id] = [];
        },
        [RECEIVE_COMMENT_LIST] (state, payload) {
            state.loading = false;
            state.id_map[payload.post_id] = payload.comments;
        }
    },
    actions: {
        requestCommentList({commit, state}, post_id) {
            if(state.id_map[post_id] && state.id_map[post_id].length) {
                return false;
            }

            commit({type: REQUEST_COMMENT_LIST, post_id});
            GET(URL_GET_COMMENT_LIST.replace(':post_id', post_id))
            .then(json => {
                let comments = json.msg === 'ok' ? json.comments : [];
                commit({type: RECEIVE_COMMENT_LIST, comments, post_id});
            });
        }
    },
    getters: {

    }
}