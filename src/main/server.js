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
// 数据储存的位置
const file = path.join(__dirname, '../data/config.json')

async function init () {
  try {
    await fs.rm(bookmarksDir, { recursive: true })
  } catch (error) { }
  await fs.mkdir(bookmarksDir, { recursive: true })
}



init().then(() => {
  let a
  router.prefix('/api/v1/config')
  router.get('/', async (ctx, next) => {
    ctx.body = {
      code: 200,
      data: {
        bookmarksDir: bookmarksDir,
        chrome: a || '',
      },
      message: 'SUCESS'
    }
    await next()
  })
  router.patch('/', async ctx => {
    const content =
    {
      chrome: ctx.request.body.chrome,
      bookmarksDir: bookmarksDir,
      time: new Date()
    }
    await fs.writeFile(file, JSON.stringify(content), async (err) => {
      if (err) {
        ctx.body = {
          code: 500,
          message: '写入失败'
        }
      }
    })
    a = ctx.request.body.chrome,
      ctx.body = {
        code: 200,
        message: 'SUCESS'
      }
  })
  // 跨域
  app.use(cors())
  app.use(bodyparser()).use(router.routes()).use(router.allowedMethods())
  app.listen(3003)
})
