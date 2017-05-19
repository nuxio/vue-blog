import Vue from 'vue';
import router from './route';
import store from './store';
import { USER_LOGIN } from './store/mutation-types';
import moment from 'moment';

// 时间展示设置为中文
moment.locale('zh-cn');

// 用户信息
let user = localStorage.getItem('user');
if(user) {
    store.commit(USER_LOGIN, {user: JSON.parse(user)});
}

const app = new Vue({
  store,
  router
}).$mount('#root');
