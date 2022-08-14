import { it, expect } from 'vitest';
import { JSDOM } from 'jsdom';
import { getBookmarks } from '../analysis-html';
import fs from 'fs';
import path from 'path';

it('test bookmark', () => {
  const bookmarkHtml = fs.readFileSync(path.join(__dirname, './fixtures/bookmark.html'), 'utf8');
  const dom = new JSDOM(bookmarkHtml);
  const document = dom.window.document;
  expect(getBookmarks(document)).toMatchInlineSnapshot(`
    [
      {
        "dirs": [],
        "name": "Google",
        "url": "https://www.google.com.sg/",
      },
      {
        "dirs": [],
        "name": "百度一下，你就知道",
        "url": "https://www.baidu.com/",
      },
      {
        "dirs": [
          "1.1",
          "1.1.1",
        ],
        "name": "Facebook - ログインまたは登録",
        "url": "https://ja-jp.facebook.com/",
      },
      {
        "dirs": [
          "1.1",
        ],
        "name": "GitHub: Where the world builds software · GitHub",
        "url": "https://github.com/",
      },
    ]
  `);
});
