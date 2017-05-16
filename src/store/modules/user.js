import { USER_LOGIN, USER_LOGOUT } from '../mutation-types';

export default {
    state: {
        is_login: false,
        user_info: {
            username: '',
            avatar_url: ''
        }
    },
    getters: {},
    mutations: {
        [USER_LOGIN] (state, payload) {
            state.is_login = true;
            state.user_info = Object.assign(state.user_info, payload.user);
            if(payload.remember) {
                localStorage.setItem('user', JSON.stringify(payload.user));
            }
        },
        [USER_LOGOUT] (state, payload) {
            state.is_login = false;
            state.user_info = Object.assign(state.user_info, {
                username: '',
                avatar_url: ''
            });
            
            localStorage.removeItem('user');
        }
    },
    actions: {}
}