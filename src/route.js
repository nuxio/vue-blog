import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './container/Home.vue';
import PostList from './container/PostList.vue';
import User from './container/User.vue';
import Login from './container/Login.vue';
import Register from './container/Register.vue';

Vue.use(VueRouter);


const routes = [
    { 
        path: '/', 
        component: Home,
        children: [
            { path: '', component: PostList },
            { path: '/login', component: Login },
            { path: '/register', component: Register }
        ]
    }
];


export default new VueRouter({
  mode: 'history',
  routes
});
