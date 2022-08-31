const Koa = require('koa')
const app = new Koa()
const fs = require('fs/promises')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
const koaBody = require("koa-body")
const cors = require("@koa/cors")
const puppeteer = require('puppeteer')

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
  router.prefix('/api/v1')
  router.get('/config', async (ctx, next) => {
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
  router.patch('/config', async ctx => {
    const content =
    {
      chrome: JSON.parse(ctx.request.body).chrome,
      bookmarksDir: bookmarksDir,
      time: new Date()
    }
    try {
      await fs.writeFile(file, JSON.stringify(content))
    } catch (err) {
      ctx.body = {
        code: 500,
        message: '写入失败'
      }
    }

    a = JSON.parse(ctx.request.body).chrome,
      ctx.body = {
        code: 200,
        message: 'SUCESS'
      }
  })
  router.post('/save', async ctx => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(JSON.parse(ctx.request.body).saveUrl)
    const session = await page.target().createCDPSession()
    await session.send('Page.enable')
    const { data } = await session.send('Page.captureSnapshot')
    fs.writeFile('./bookmark.mhtml', data)
    await browser.close()
    ctx.body = {
      code: 200,
      message: 'SUCESS'
    }
  })
  // 跨域
  app.use(cors())
  app.use(koaBody()).use(router.routes()).use(router.allowedMethods())
  app.listen(3003)
})
