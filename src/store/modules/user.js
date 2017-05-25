import { USER_LOGIN, USER_LOGOUT, REQUEST_USER_INFO, RECEIVE_USER_INFO } from '../mutation-types';
import { get as GET } from '../../util/fetch';
import { URL_USER_INFO } from '../api';

export default {
    state: {
        is_login: false,
        user_info: {
            username: '',
            avatar_url: ''
        },
        user_list: {
            loading: false
        }
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
        [REQUEST_USER_INFO] (state, payload) {
            state.user_list[payload.username] = {};
            state.user_list.loading = true;
        },
        [RECEIVE_USER_INFO] (state, payload) {
            state.user_list[payload.user.username] = payload.user;
            state.user_list.loading = false;
        }
    },
    actions: {
        requestUserInfo({ commit, state }, payload) {
            if(state.user_list.loading) return false;

            commit({ type: REQUEST_USER_INFO, username: payload.username });

            GET(URL_USER_INFO.replace(':username', payload.username))
            .then(json => {
                if(json.msg === 'ok') {
                    commit({type: RECEIVE_USER_INFO, user: json.user});
                    // 更新用户信息
                    if(json.user.username == state.user_info.username && state.is_login) {
                        commit({ type: USER_LOGIN, user: json.user, remember: 1 });
                    }
                } else {
                    alert(json.msg);
                }
            });
        }
    }
}