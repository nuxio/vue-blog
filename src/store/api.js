// user
export const URL_USER_REGISTER = 'http://localhost:3000/api/register';
export const URL_USER_LOGIN = 'http://localhost:3000/api/login';
export const URL_USER_LOGOUT = 'http://localhost:3000/api/logout';
export const URL_USER_INFO = 'http://localhost:3000/api/user/:username';
export const URL_USER_UPLOAD_AVATAR = 'http://localhost:3000/api/upload/avatar/:username';

// post
export const URL_GET_POST_LIST = 'http://localhost:3000/api/blogs';
export const URL_GET_POST_DETAIL = 'http://localhost:3000/api/blog/';
export const URL_CREATE_POST = 'http://localhost:3000/api/create';
export const URL_BLOG_VOTE = 'http://localhost:3000/api/blog/:post_id/up';
export const URL_BLOG_DELETE = 'http://localhost:3000/api/blog/delete';

// comment
export const URL_GET_COMMENT_LIST = 'http://localhost:3000/api/:post_id/comments';
export const URL_SUBMIT_COMMENT = 'http://localhost:3000/api/:post_id/comment';
export const URL_COMMENT_VOTE = 'http://localhost:3000/api/comment/:comment_id/up';
export const URL_COMMENT_DELETE = 'http://localhost:3000/api/comment/delete';