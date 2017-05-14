import { REQUEST_POST_LIST, RECEIVE_POST_LIST } from '../mutation-types';
import { URL_GET_POST_LIST } from '../api';
import {get as GET} from '../../util/fetch';

export default {
    state: {
        list: [{id: '123', title: 'xxxx', author: 'wuqiang', create_at: '2017-5-12 16:46:19'}],
        loading: false
    },
    mutations: {
        [REQUEST_POST_LIST] (state) {
            state.loading = true;
        },
        [RECEIVE_POST_LIST] (state, payload) {
            state.list = payload.list;
            state.loading = false;
        }
    },
    getters: {

    },
    actions: {
        requestPostList({commit}) {
            commit({type: REQUEST_POST_LIST});
            GET(URL_GET_POST_LIST).then(json => {
                if(json.msg === 'ok') {
                    commit({type: RECEIVE_POST_LIST, list: json.list});
                } else {

                }
            });
        }
    }
}