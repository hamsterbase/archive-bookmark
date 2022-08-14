const Koa = require('koa');
const app = new Koa();
const fs = require('fs/promises');
const path = require('path');

/**
 * 网页储存的位置
 */
const bookmarksDir = path.join(__dirname, '../../bookmarks');

async function init() {
  try {
    await fs.rm(bookmarksDir, { recursive: true });
  } catch (error) {}
  await fs.mkdir(bookmarksDir, { recursive: true });
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
  app.use((ctx) => {
    ctx.body = 'Hello Koa';
  });
  app.listen(3008);
});
