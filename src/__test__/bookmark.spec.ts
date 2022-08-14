import { it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { getBookmarks } from '../analysis-html';
// import fs from 'fs';
let fs = require('fs');
let path = require('path');

it('test bookmark', () => {
  const bookmarkHtml = fs.readFileSync(path.join(__dirname, './fixtures/bookmark.html'), 'utf8');
  const dom = new JSDOM(bookmarkHtml);
  const document = dom.window.document;
  expect(getBookmarks(document)).toEqual([
    {
      url: 'https://www.dianyinggou.com/',
      name: '电影狗 - 专业电影搜索引擎',
      dirs: ['/'],
    },
    {
      url: 'https://www.baidu.com/',
      name: '百度一下，你就知道',
      dirs: ['/'],
    },
    {
      url: 'https://www.baidu.com/?tn=44004473_35_oem_dg',
      name: '百度一下，你就知道',
      dirs: ['/'],
    },
    {
      url: 'http://www.lrjyllh.com/dongman/',
      name: '樱花动漫首页-樱花动漫专注动漫的门户网站*实时更新*',
      dirs: ['/'],
    },
    {
      url: 'https://www.zhihu.com/question/393590400/answer/1214165808',
      name: '想自学前端，该怎么开始学，从哪学起呢？ - 知乎',
      dirs: ['/'],
    },
    {
      url: 'https://chinese.freecodecamp.org/learn/responsive-web-design/basic-html-and-html5/nest-an-anchor-element-within-a-paragraph',
      name: '基础 HTML 和 HTML5: 将 a 嵌套在段落中 | freeCodeCamp.org',
      dirs: ['/'],
    },
    {
      url: 'https://chinese.freecodecamp.org/learn',
      name: '免费学习编程 - Python、JavaScript、Java、Git 等',
      dirs: ['/'],
    },
    {
      url: 'https://www.bilibili.com/',
      name: '哔哩哔哩 (゜-゜)つロ 干杯~-bilibili',
      dirs: ['/'],
    },
    {
      url: 'https://speed17.com/#/dashboard',
      name: 'Speed17|放心云',
      dirs: ['/'],
    },
    {
      url: 'https://github.com/hamsterbase',
      name: 'hamsterbase · GitHub',
      dirs: ['/'],
    },
    {
      url: 'https://www.feishu.cn/docs/doccnjs9gZpkwI3TibtzrkulXNc',
      name: '第一天 配置环境 - 飞书文档',
      dirs: ['/'],
    },
    {
      url: 'https://ant.design/components/table-cn/#header',
      name: '表格 Table - Ant Design',
      dirs: ['/'],
    },
    {
      url: 'https://cn.vitejs.dev/',
      name: 'Vite | 下一代的前端工具链',
      dirs: ['/'],
    },
    {
      url: 'https://dltcjun8al.feishu.cn/minutes/obcns8267nn2486p57q84jx2',
      name: '杨绵绵的视频会议',
      dirs: ['/'],
    },
    {
      url: 'https://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html',
      name: 'Commit message 和 Change log 编写指南 - 阮一峰的网络日志',
      dirs: ['/'],
    },
    {
      url: 'https://ant.design/components/upload-cn/#header',
      name: '上传 Upload - Ant Design',
      dirs: ['/'],
    },
  ]);
});
