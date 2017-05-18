import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './container/Home.vue';
import PostList from './container/PostList.vue';
// 用了webpack的import方法，需要"syntax-dynamic-import"babel插件支持
// 异步加载组件
const PostDetail = () => import('./container/PostDetail.vue');
const User = () => import('./container/User.vue');
const Login = () => import('./container/Login.vue');
const Register = () => import('./container/Register.vue');
const Create = () => import('./container/Create.vue');

Vue.use(VueRouter);

const routes = [
    { 
        path: '/', 
        component: Home,
        children: [
            { path: '', component: PostList },
            { path: '/login', component: Login },
            { path: '/register', component: Register },
            { path: '/create', component: Create },
            { path: '/create/:post_id', component: Create },
            { path: '/post/:post_id', component: PostDetail }
        ]
    }
];

export default new VueRouter({
  mode: 'history',
  routes
});
