import { 
    RECEIVE_COMMENT_LIST, 
    COMMENT_VOTE_UP, 
    COMMENT_VOTE_DOWN, 
    COMMENT_DELETE, 
    COMMENT_MOUSEOVER, 
    COMMENT_MOUSELEAVE,
    COMMENT_SHOW_REPLY,
    COMMENT_HIDE_REPLY
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
        [COMMENT_MOUSEOVER] (state, payload) {
            state.id_map[payload.post_id][payload.index].hover = true;
            state.count ++;
        },
        [COMMENT_MOUSELEAVE] (state, payload) {
            state.id_map[payload.post_id][payload.index].hover = false;
            state.count ++;
        },
        [COMMENT_SHOW_REPLY] (state, payload) {
            state.id_map[payload.post_id][payload.index].show_reply = true;
            state.count ++;
        },
        [COMMENT_HIDE_REPLY] (state, payload) {
            state.id_map[payload.post_id][payload.index].show_reply = false;
            state.id_map[payload.post_id][payload.index].reply_content = '';
            state.count ++;
        },
        [COMMENT_VOTE_UP] (state, payload) {
            state.count++;
            state.id_map[payload.post_id].forEach(c => {
                if(c._id === payload.comment_id) {
                    c.up++;
                    c.ups.push(payload.user);
                }
            });
        },
        [COMMENT_VOTE_DOWN] (state, payload) {
            state.count++;
            state.id_map[payload.post_id].forEach(c => {
                if(c._id === payload.comment_id) {
                    c.up--;
                    c.ups = c.ups.filter(u => u.username !== payload.user.username);
                }
            });
        },
        [COMMENT_DELETE] (state, payload) {
            state.count++;
            state.id_map[payload.post_id] = state.id_map[payload.post_id].filter(c => c._id !== payload.comment_id);
        }
    }
}