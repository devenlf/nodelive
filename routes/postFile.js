const router = require('koa-router')()
const User = require('../db/features')

router.prefix('/postFile')

// 发布
router.post('/saveFabu', function (ctx, next) {
    console.log(ctx)
})