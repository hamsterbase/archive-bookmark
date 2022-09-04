const Koa = require('koa')
const app = new Koa()
const fs = require('fs/promises')
const path = require('path')
const Router = require('koa-router')
const router = new Router()
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const puppeteer = require('puppeteer')
const md5 = require('md5')

/**
 * 网页储存的位置
 */
const bookmarksDir = path.join(__dirname, '../../bookmarks')
// 数据储存的位置
const file = path.join(__dirname, '../data/config.json')

const distDir = path.join(__dirname, '../../dist')

async function init () {
  try {
    await fs.rm(bookmarksDir, { recursive: true })
    await fs.rm(file, { recursive: true })
    await fs.rm(distDir, { recursive: true })
  } catch (error) { }
  await fs.mkdir(bookmarksDir, { recursive: true })
  await fs.mkdir(file, { recursive: true })
  await fs.mkdir(distDir, { recursive: true })
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
      message: 'SUCCESS',
    }
    await next()
  })
  router.patch('/config', async (ctx) => {
    const content = {
      chrome: JSON.parse(ctx.request.body).chrome,
      bookmarksDir: bookmarksDir,
      time: new Date(),
    }
    try {
      await fs.writeFile(file, JSON.stringify(content))
    } catch (err) {
      ctx.body = {
        code: 500,
        message: '写入失败',
      }
    }

    (a = JSON.parse(ctx.request.body).chrome),
      (ctx.body = {
        code: 200,
        message: 'SUCCESS',
      })
  })
  router.post('/save', async (ctx) => {
    const { url, name } = JSON.parse(ctx.request.body)
    const browser = await puppeteer.launch({
      executablePath: a,
    })
    const page = await browser.newPage()
    await page.goto(url)
    const session = await page.target().createCDPSession()
    await session.send('Page.enable')
    const { data } = await session.send('Page.captureSnapshot')
    try {
      await fs.writeFile(path.join(distDir, `${name}${md5(url)}.mhtml`), data)
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '保存失败',
      }
    }
    await browser.close()

    ctx.body = {
      code: 200,
      message: 'SUCCESS',
    }
  })
  // 跨域
  app.use(cors())
  app.use(koaBody()).use(router.routes()).use(router.allowedMethods())
  app.listen(3003)
})
