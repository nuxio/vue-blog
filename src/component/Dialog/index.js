import Vue from 'vue';
import DialogVue from './Dialog.vue';
let DialogConstructor = Vue.extend(DialogVue);

let Dialog = options => {
    let instance = new DialogConstructor({data: options});
    instance.vm = instance.$mount();
    document.body.appendChild(instance.$el);
    instance.vm.show = true;
    return instance.vm;
};

Vue.prototype.$alert = options => {
    if(typeof options === 'string') options = { message: options };
    options.dtype = 'alert';
    Dialog(options);
};

Vue.prototype.$confirm = (message, onConfirm, rest) => {
    let options = {
        message,
        onConfirm,
        ...rest,
        dtype: 'confirm'
    };

    if(!options.type) options.type = 'confirm';
    Dialog(options);
};