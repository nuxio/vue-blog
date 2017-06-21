<template>
<li class="comment-item" @mouseenter="showMoreBtn(index)" @mouseleave="hideMoreBtn(index)">
    <div class="comment-item-user">
        <router-link :to="`/user/${c.author.username}`">
            <img :src="c.author.avatar_url" />
            <br />
            {{c.author.username}}
        </router-link>
    </div>
    <div class="comment-item-content-box">
        <div class="comment-item-info">
            <span>{{index+1}}楼 · <span v-if="c.reply_to">回复{{c.reply_who.username}}于</span>{{getCreateTime(c.create_at)}} &nbsp;</span>
            <button class="btn-normal" @click="vote(c)">
                <i :class="['fa', isVoted(c.ups) ? 'fa-thumbs-up' : 'fa-thumbs-o-up']" aria-hidden="true"></i> 赞（{{c.up}}）
            </button>
            &nbsp;
            <button class="btn-normal" v-show="is_login && c.hover" @click="showReply(index)">
                <i class="fa fa-reply" aria-hidden="true"></i> 回复
            </button>
            &nbsp;
            <button class="btn-normal" v-show="is_login && c.author.username === user_info.username && c.hover" @click="deleteComment(c._id)">
                <i class="fa fa-trash-o" aria-hidden="true"></i> 删除
            </button>
            &nbsp;
        </div>
        <div class="comment-item-content markdown-body" v-html="getMarkedContent(c.content)"></div>
        <div v-if="c.show_reply" class="comment-reply-box">
            <form @submit.prevent="submitComment(c.reply_content, c._id)">
                <editor v-model="c.reply_content" height="200px" width="100%" display="block" :placeholder="`回复${c.author.username}`"></editor>
                <br />
                <button type="submit" :disabled="loading_submit" class="btn btn-primary">{{loading_submit ? '提交中...' : '提交'}}</button>
                <button type="button" class="btn btn-default" @click="hideReply(index)">取消</button>
            </form>
        </div>
    </div>
</li>
</template>

<script>
export default {
  
}
</script>

<style>

</style>