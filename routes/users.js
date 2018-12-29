const router = require('koa-router')()
const User = require('../db/user')
var request = require('request');
var userState;    //0为登陆过   //1为未登录

router.prefix('/users')


//登陆拉取信息
router.get('/getLogin', async function (ctx, next) {
  //初始化状态
  userState = 0;
  if (ctx.query.code) {
    var userInfoData;
    await getOpenIdAndKey(ctx.query.code).then((data) => {
      userInfoData = data
    })
    ctx.body = {
      data: userInfoData,
      success: true,
      message: '返回成功'
    }
  } else {
    ctx.body = {
      success: false,
      message: '返回失败'
    }
  }
})

//判断是否使用过
router.post('/ishaveUse', async function (ctx, next) {
  await pushUserInfo(ctx);
  ctx.body = {
    userState,
    success: true
  }
})



//新建用户
router.post('/newUser', async function (ctx) {
  var messageTxt;
  var dataValue = ctx.request.body
  //防止重复注册
  await pushUserInfo(ctx);
  if (userState === 0) {
    ctx.body = {
      success: true,
      message: '数据存在'
    }
    return
  }

  await new Promise(function (resolve, reject) {
    new User({
      id: dataValue.id,
      naickName: dataValue.naickName,
      hobby: dataValue.hobby,
      age: dataValue.age,
      sex: dataValue.sex,
      phone: dataValue.phone,
      grade: 0
    }).save(function (err, res) {
      if (err) {
        messageTxt = "数据库错误"
        reject()
        return
      } else {
        messageTxt = "注册成功"
        resolve()
      }
    })
  })

  ctx.body = {
    success: true,
    message: messageTxt
  }
})


//拉去个人信息
router.post('/userInfo', async function (ctx) {
  if (ctx.request.body.id) {
    var dataUser = {};
    await User.find({ 'id': ctx.request.body.id }, function (err, comment) {
      if (err)
        return
      if (comment.length) {
        dataUser = comment[0]
      } else {
        dataUser = null
      }
    })
    ctx.body = {
      success: true,
      data: dataUser
    }
  } else {
    ctx.body = {
      success: false,
      message: "信息拉去失败"
    }
  }
})


router.post('/saveFabu', function (ctx, next) {

})


function getOpenIdAndKey(code) {
  return new Promise((resolve, reject) => {
    request.get({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      json: true,
      qs: {
        grant_type: 'authorization_code',
        appid: 'wx236c63e60c5231e1',
        secret: 'bc490af12c4ffb6f1686b6b131168dcd',
        js_code: code
      }
    }, (err, response, data) => {
      if (err) {
        reject(err)
        return
      }
      if (response.statusCode === 200) {
        //TODO: 生成一个唯一字符串sessionid作为键，将openid和session_key作为值，存入redis，超时时间设置为2小时
        //伪代码: redisStore.set(sessionid, openid + session_key, 7200)
        // res.json({ sessionid: sessionid })
        resolve(data)
      } else {
        reject(err)
        console.log("[error]", err)
      }
    })
  })
}

//拉去用户 先查找在进行存储（是否使用过）
function pushUserInfo(ctx) {
  return new Promise(function (resolve, reject) {
    User.find({ id: ctx.request.body.id }, function (err, res) {
      if (err) {
        console.log(err)
        reject(err)
        return
      } else {
        //如果查找不到新建用户
        if (!res.length) {
          userState = 1
        } else {
          userState = 0
        }
        resolve(userState)
      }
    })
  })
}

module.exports = router
