import { 
    REQUEST_POST_LIST, 
    RECEIVE_POST_LIST,
    REQUEST_POST_DETAIL,
    RECEIVE_POST_DETAIL,
    POST_VOTE_UP,
    POST_VOTE_DOWN
} from '../mutation-types';
import { URL_GET_POST_LIST, URL_GET_POST_DETAIL } from '../api';
import { get as GET } from '../../util/fetch';

export default {
    state: {
        list: [],
        total_num: 0,
        loading: false,
        page: 1,
        limit: 10,
        id_map: { loading: false },
        vote_time: 0 // 西八
    },
    mutations: {
        [REQUEST_POST_LIST] (state, payload) {
            state.page = payload.page;
            state.loading = true;
        },
        [RECEIVE_POST_LIST] (state, payload) {
            state.list = payload.list;
            state.total_num = payload.total_num;
            state.loading = false;
        },
        [REQUEST_POST_DETAIL] (state, payload) {
            state.id_map[payload.id] = {};
            state.id_map.loading = true;
        },
        [RECEIVE_POST_DETAIL] (state, payload) {
            state.id_map.loading = false;
            state.id_map[payload.post._id] = payload.post;
        },
        [POST_VOTE_UP] (state, payload) {
            state.id_map[payload.post_id].ups.push(payload.uper);
            state.id_map[payload.post_id].up++;
            state.vote_time++;
        },
        [POST_VOTE_DOWN] (state, payload) {
            state.id_map[payload.post_id].ups = state.id_map[payload.post_id].ups.filter(u => u.username !== payload.uper.username);
            state.id_map[payload.post_id].up--;
            state.vote_time++;
        }
    },
    getters: {
        total_page(state) {
            let total_num = state.total_num,
                limit = state.limit;
            return Math.ceil(total_num / limit, 10);
        }
    },
    actions: {
        requestPostList({ commit, state }, payload) {
            if(state.loading) return false;

            commit({type: REQUEST_POST_LIST, page: payload.page});

            GET(URL_GET_POST_LIST, {page: payload.page, limit: state.limit})
            .then(json => {
                if(json.msg === 'ok') {
                    commit({
                        type: RECEIVE_POST_LIST, 
                        list: json.blogs, 
                        page: json.page, 
                        total_num: json.total_num
                    });
                } else {
                    alert(json.msg);
                    commit({type: RECEIVE_POST_LIST, list: []});
                }
            });
        },
        requestPostDetail({commit, state}, id) {
            if(state.id_map[id]) {
                return false;
            }
            commit({type: REQUEST_POST_DETAIL, id});
            GET(URL_GET_POST_DETAIL + id)
            .then(json => {
                let post = json.msg === 'ok' ? json.blog : {msg: json.msg};
                commit({type: RECEIVE_POST_DETAIL, post});
            });
        }
    }
}