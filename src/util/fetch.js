import fetch from 'isomorphic-fetch';

/**
 * 返回数据类型
 **/
const type = (o) => {
    let reg = /^\[object (.*)\]$/;
    let type_string = Object.prototype.toString.call(o);
    return type_string.replace(reg, '$1').toLowerCase();
}

/**
 * 将对象转换成查询字符串
 **/
const ObjectToParamsString = (data, prefix) => {
    let keys = Object.keys(data);
    let key = '', val = '', t = '', res = '';
    for(let i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        val = data[key];
        key = prefix ? (prefix + '[' + key + ']') : key;
        t = type(val);
        switch (t) {
            case 'array':
            case 'object':
                res += ObjectToParamsString(val, key);
                break;
            default:
                res += encodeURIComponent(key) + '=' + encodeURIComponent(val) + '&';
        }
    }
    return res.replace(/&$/, '');
}

export const proxy = (o) => {
    let method = o.method ? o.method.toUpperCase() : 'GET';
    let data = o.data || {};
    // data._csrf = document.querySelector('meta[name="token"]').content;
    let parmas_string = ObjectToParamsString(data);
    let options = {
        credentials: process.env.NODE_ENV === 'production' ?  (o.credentials || 'same-origin') : 'include', // 携带cookie
        method
    };
    // 目前只用到GET和POST，剩下的有时间再研究研究
    if(method === 'GET') {
        parmas_string && (o.url += '?' + parmas_string);
    } else {
        options.headers = {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        };
        options.body = parmas_string;
    }
    // 需要返回一个promise对象
    return fetch(o.url, options)
        .then(res => res.json())
        .catch(err => console.log(err));
}

// 上传专用
export const upload = (o) => {
    let options = {
        method: 'POST',
        body: o.formData,
        credentials: process.env.NODE_ENV === 'production' ?  (o.credentials || 'same-origin') : 'include' // 开发
    };

    return fetch(o.url, options)
            .then(res => res.json())
            .catch(err => console.log(err));
}

export const get = (url, data) => {
    return proxy({
        method: 'GET',
        url,
        data
    });
}

export const post = (url, data) => {
    return proxy({
        method: 'POST',
        url,
        data
    });
}