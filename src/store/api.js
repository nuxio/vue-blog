// user
export const URL_USER_REGISTER = '/api/register';
export const URL_USER_LOGIN = '/api/login';
export const URL_USER_LOGOUT = '/api/logout';
export const URL_USER_INFO = '/api/user/:username';
export const URL_USER_UPLOAD_AVATAR = '/api/upload/avatar/:username';

// post
export const URL_GET_POST_LIST = '/api/blogs';
export const URL_GET_POST_DETAIL = '/api/blog/';
export const URL_CREATE_POST = '/api/create';
export const URL_BLOG_VOTE = '/api/blog/:post_id/up';
export const URL_BLOG_DELETE = '/api/blog/delete';

// comment
export const URL_GET_COMMENT_LIST = '/api/:post_id/comments';
export const URL_SUBMIT_COMMENT = '/api/:post_id/comment';
export const URL_COMMENT_VOTE = '/api/comment/:comment_id/up';
export const URL_COMMENT_DELETE = '/api/comment/delete';