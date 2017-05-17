import { RECEIVE_COMMENT_LIST } from '../mutation-types';

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
        }
    }
}