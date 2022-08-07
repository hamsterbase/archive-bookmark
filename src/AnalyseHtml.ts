export function AnalyseHtml(file: File) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('File is not defined');
    }
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
      const header = mainDocument.querySelector('h1');
      //找到书签的根
      const root = header?.nextElementSibling || mainDocument.body;

      //找到全部的书签
      const linksElements = Array.from(root.querySelectorAll('a'));
      let cnt = 0;
      const links = linksElements.map((link) => {
        let parent: any = link?.parentNode;
        let parents = [];

        while (parent) {
          //我们可以发现，所有的文件夹都是 H3, 然后加一个 DL
          if (parent?.tagName === 'DL') {
            //找到 h3 的标题
            const textContent = `/${parent.previousElementSibling?.textContent}/${link.textContent}`;
            parents.unshift(textContent);
          }
          parent = parent.parentNode;
        }

        if (parents.length == 2) {
          //parents.unshift('/');
          parents.push('/');
        }
        cnt++;
        return {
          key: cnt,
          href: link.getAttribute('href'),
          title: link.textContent,
          //忽略最外面两层文件夹
          dirs: parents.slice(2),
        };
      });
      resolve(links);
    };
  });
}
