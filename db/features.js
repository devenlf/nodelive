var mongoose = require('./index'),
    Schema = mongoose.Schema;


let post = new Schema({
    id: { type: String },    //发帖人Id
    title: { type: String },
    nameText: { type: String },
    nickName: { type: String },  //发帖人
    content: { type: Text },   //内容
    grade: {type : Number},  //等级
    Pageviews:{type:Number},  //浏览量
})


module.exports = post