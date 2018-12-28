var mongoose = require('./index'),
    Schema = mongoose.Schema;

let UserSchema = new Schema({
    id: { type: String },
    naickName: { type: String },
    hobby: { type: String },
    age: { type: Number },
    sex: { type: String },
    grade: { type: Number }
});

module.exports = mongoose.model('userinfo', UserSchema);