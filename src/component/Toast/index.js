import Vue from 'vue';
import ToastVue from './Toast.vue';
let ToastConstructor = Vue.extend(ToastVue);

let Toast = options => {
    options = options || { message: 'Undefined options for toast.', type: 'error' };
    options = typeof options === 'string' ? { message: options } : options;
    let instance = new ToastConstructor({data: options});
    instance.vm = instance.$mount();
    document.body.appendChild(instance.vm.$el);
    instance.vm.show = true;
    return instance.vm;
};

['success', 'warn', 'info', 'error'].forEach(type => {
    Toast[type] = options => {
        options = options || { message: 'Undefined options for toast.', type: 'error' };
        if (typeof options === 'string') options = { message: options };
        options.type = type;
        return Toast(options);
    };
});

Vue.prototype.$toast = Toast;