import Vue from 'vue';
import router from './route';
import store from './store';

const app = new Vue({
  store,
  router
}).$mount('#root');
