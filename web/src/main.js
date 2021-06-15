import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App.vue';

import utils from './utils';

Vue.use(VueRouter);
Vue.use(VueResource);

const utilsPlugin = {
    install() {
        Vue.utils = utils;
        Vue.prototype.$utils = utils;
    },
};
Vue.use(utilsPlugin);

const Test = { template: '<h1>test</h1>' };

const router = new VueRouter({
    mode: 'history',
    routes: [
        { path: '/', component: App },
        { path: '/search', component: App },
        { path: '/test', component: Test },
    ],
});

new Vue({ router }).$mount('#app');
