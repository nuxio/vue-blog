import Vue from 'vue';
import VueRouter from 'vue-router';
import NProgress from './util/nprogress';

import Home from './container/Home.vue';

const PostList = () => {
    NProgress.start();
    let imp = import('./container/Post/List.vue');
    imp.then(c => NProgress.done());
    return imp;
};
// 用了webpack的import方法，需要"syntax-dynamic-import"babel插件支持
// 异步加载组件
// import() 依赖于promise，所以感觉还是有必要加上兼容代码
// 目前貌似不支持在import()方法外封装一层，会加载不到
// const loadComponent = (path) => {
//     return () => {
//         let imp = import(path);
//         imp.then(component => console.log('loaded!'));
//         return imp;
//     }
// }
const PostDetail = () => {
    NProgress.start();
    let imp = import('./container/Post/Detail.vue');
    imp.then(c => NProgress.done());
    return imp;
};
const User = () => {
    NProgress.start();
    let imp = import('./container/User/Info.vue');
    imp.then(c => NProgress.done());
    return imp;
};
const EditUser = () => {
    NProgress.start();
    let imp = import('./container/User/Edit.vue');
    imp.then(c => NProgress.done());
    return imp;
};
const Login = () => {
    NProgress.start();
    let imp = import('./container/User/Login.vue');
    imp.then(c => NProgress.done());
    return imp;
};
const Register = () => {
    NProgress.start();
    let imp = import('./container/User/Register.vue');
    imp.then(c => NProgress.done());
    return imp;
};
const Create = () => {
    NProgress.start();
    let imp = import('./container/Post/Create.vue');
    imp.then(c => NProgress.done());
    return imp;
};

const Test = () => {
    NProgress.start();
    let imp = import('./container/Test.vue');
    imp.then(c => NProgress.done());
    return imp;
};

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
            { path: '/post/:post_id', component: PostDetail },
            { path: '/user/:username', component: User },
            { path: '/user/:username/edit', component: EditUser },
            { path: '/test', component: Test }
        ]
    }
];

export default new VueRouter({
  mode: 'history',
  routes
});
