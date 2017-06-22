import { 
    RECEIVE_COMMENT_LIST, 
    COMMENT_DELETE
} from '../mutation-types';

export default {
    state: {
        // 只是为了让组件检测到列表更新
        count: 0,
        id_map: {}
    },
    mutations: {
        [RECEIVE_COMMENT_LIST] (state, payload) {
            state.count ++;
            state.id_map[payload.post_id] = payload.comments;
        },
        [COMMENT_DELETE] (state, payload) {
            state.id_map[payload.post_id] = state.id_map[payload.post_id].filter(c => c._id !== payload.comment_id);
            state.count++;
        }
    }
}