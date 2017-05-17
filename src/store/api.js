// user
export const URL_USER_REGISTER = 'http://localhost:3000/register';
export const URL_USER_LOGIN = 'http://localhost:3000/login';
export const URL_USER_LOGOUT = 'http://localhost:3000/logout';
export const URL_USER_INFO = 'http://localhost:3000/user/:username';
export const URL_USER_UPLOAD_AVATAR = 'http://localhost:3000/upload/avatar/:username';

// post
export const URL_GET_POST_LIST = 'http://localhost:3000/blogs';
export const URL_GET_POST_DETAIL = 'http://localhost:3000/blog/';
export const URL_CREATE_POST = 'http://localhost:3000/create';
export const URL_BLOG_VOTE = 'http://localhost:3000/blog/:post_id/up';

// comment
export const URL_GET_COMMENT_LIST = 'http://localhost:3000/:post_id/comments';
export const URL_SUBMIT_COMMENT = 'http://localhost:3000/:post_id/comment';