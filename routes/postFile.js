const router = require('koa-router')()
const Post = require('../db/features')

router.prefix('/postFile')

// 发布
router.post('/saveFabu', async function (ctx, next) {
    let dataValue = ctx.request.body
    await new Promise(function (resolve, reject) {
        new Post({
          id: dataValue.openId,
          title:dataValue.titleValue,
          content: dataValue.datalist,
          avatarUrl: dataValue.avatarUrl,
          nickName: dataValue.nickName,
          Pageviews:0
        }).save(function (err, res) {
          if (err) {
            messageTxt = "错误"
            reject()
            return
          } else {
            messageTxt = "成功"
            resolve()
          }
        })
      })
})

module.exports = router
