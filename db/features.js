var mongoose = require('./index'),
    Schema = mongoose.Schema;


let post = new Schema({
    id: { type: String },    //发帖人Id
    title: { type: String },  //标题
    nickName: { type: String },  //发帖人
    content: { type: Array },   //内容
    Pageviews:{type:Number},  //浏览量
    avatarUrl:{ type: String } //头像
})

module.exports = mongoose.model('post', post);
