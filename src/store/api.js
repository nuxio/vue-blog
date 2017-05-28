// user
const prefix = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
export const URL_USER_REGISTER      = prefix + '/api/register';
export const URL_USER_LOGIN         = prefix + '/api/login';
export const URL_USER_LOGOUT        = prefix + '/api/logout';
export const URL_USER_INFO          = prefix + '/api/user/:username';
export const URL_USER_UPLOAD_AVATAR = prefix + '/api/upload/avatar/:username';

// post
export const URL_GET_POST_LIST        = prefix + '/api/blogs';
export const URL_GET_POST_DETAIL      = prefix + '/api/blog/';
export const URL_CREATE_POST          = prefix + '/api/create';
export const URL_BLOG_VOTE            = prefix + '/api/blog/:post_id/up';
export const URL_BLOG_DELETE          = prefix + '/api/blog/delete';
export const URL_USER_UPLOAD_POST_IMG = prefix + '/api/blog/upload';

// comment
export const URL_GET_COMMENT_LIST = prefix + '/api/:post_id/comments';
export const URL_SUBMIT_COMMENT   = prefix + '/api/:post_id/comment';
export const URL_COMMENT_VOTE     = prefix + '/api/comment/:comment_id/up';
export const URL_COMMENT_DELETE   = prefix + '/api/comment/delete';