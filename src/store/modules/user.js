import { USER_LOGIN, USER_LOGOUT, GET_USER_INFO } from '../mutation-types';

export default {
    state: {
        is_login: false,
        user_info: {
            username: '',
            avatar_url: ''
        },
        user_list: {}
    },
    mutations: {
        [USER_LOGIN] (state, payload) {
            state.is_login = true;
            state.user_info = Object.assign(state.user_info, payload.user);
            if(payload.remember) {
                localStorage.setItem('user', JSON.stringify(payload.user));
            }
            // 顺便塞进去
            state.user_list[payload.user.username] = payload.user;
        },
        [USER_LOGOUT] (state, payload) {
            state.is_login = false;
            state.user_info = Object.assign(state.user_info, {
                username: '',
                avatar_url: ''
            });
            
            localStorage.removeItem('user');
        },
        [GET_USER_INFO] (state, payload) {
            state.user_list[payload.user.username] = payload.user;
        }
    }
}