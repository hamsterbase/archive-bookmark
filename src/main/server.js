const Koa = require('koa')
const app = new Koa()
const fs = require('fs/promises')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
const bodyparser = require("koa-bodyparser")
const cors = require("@koa/cors")


/**
 * 网页储存的位置
 */
const bookmarksDir = path.join(__dirname, '../../bookmarks')
async function init () {
  try {
    await fs.rm(bookmarksDir, { recursive: true })
  } catch (error) { }
  await fs.mkdir(bookmarksDir, { recursive: true })
}



init().then(() => {
  /**
   *
   * 1. 获取 bookmarksDir 地址
   * 2. 获取 chrome 地址。 默认 null
   *
   * GET /api/v1/config
   *
   *
   * 1. 更新 chrome 地址. 浏览器打开 chrome://version/, 找 Executable Path
   * PATCH /api/v1/config
   *
   */
  let a
  router.prefix('/api/v1')
  router.get('/1', async (ctx, next) => {
    ctx.body = {
      bookmarksDir: bookmarksDir,
      chrome: a || '',
    }
    await next()
  })
  router.patch('/2', async ctx => {
    a = ctx.request.body.chrome
    ctx.body = 'success'
  })


  app.use(cors())
  app.use(bodyparser()).use(router.routes()).use(router.allowedMethods())
  app.listen(3008)
})
