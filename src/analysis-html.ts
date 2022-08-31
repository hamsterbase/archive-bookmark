export interface BookmarkLink {
  //这里写好类型
  name: string | null;
  url: string | null;
  dirs: Array<string>;
  [key: string]: any;
}

interface IParent {
  [key: string]: any;
}
export function getBookmarks(document: Document): BookmarkLink[] {
  //解析的逻辑
  const header = document.querySelector('h1');
  //找到书签的根
  const root = header?.nextElementSibling || document.body;
  //找到全部的书签
  const linksElements = Array.from(root.querySelectorAll('a'));
  const links = linksElements.map((link: HTMLAnchorElement) => {
    let parent: IParent = link.parentNode || {};
    let parents = [];

    while (parent) {
      //我们可以发现，所有的文件夹都是 H3, 然后加一个 DL
      if (parent?.tagName === 'DL') {
        //找到 h3 的标题
        const textContent = `${parent?.previousSibling?.previousSibling?.textContent}`;
        parents.unshift(textContent);
      }
      parent = parent?.parentNode;
    }
    return {
      url: link.getAttribute('href'),
      name: link.textContent,
      //忽略最外面两层文件夹
      dirs: parents.slice(2),
    };
  });
  return links;
}
export function AnalyseHtml(file: File): Promise<BookmarkLink[]> {
  return new Promise((resolve, reject) => {
    // if (!file) {
    //   reject('File is not defined');
    // }
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      //初始化htmlStr为空字符串
      let htmlStr = '';
      //对字符串进行拼接
      htmlStr += reader.result;
      //将字符串转为dom
      const parser = new DOMParser();
      const mainDocument = parser.parseFromString(htmlStr, 'text/html');
      resolve(getBookmarks(mainDocument));
    };
  });
}
