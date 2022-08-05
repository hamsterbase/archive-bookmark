import { useState } from 'react';
import './App.css';
import { UploadOutlined } from '@ant-design/icons';
import { Table, Button, Upload } from 'antd';
import 'antd/dist/antd.css';

function App() {
  //定义公共数据源
  const Datalist = new Array();
  //定义table列
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地址',
      dataIndex: 'url',
      key: 'url',
    },
    {
      title: '文件夹',
      dataIndex: 'dirs',
      key: 'dirs',
    },
  ];
  //模拟数据
  const data = { key: '1', name: 'baidu', url: 'www.baidu.com', dirs: 'first' };
  //填充table表
  //const dataSource = new Array(1).fill(data);
  //
  const [tableData, setTableData] = useState(Array);

  //  自定义上传函数
  const uploadHtml = (options: any) => {
    const { onSuccess, onError, file, filename, onProgress, onChange } = options;
    //将上传html网页转为字符串
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      //控制台字符串输出
      //console.log(reader.result);
      //初始化htmlStr为空字符串
      let htmlStr = '';
      //对字符串进行拼接
      htmlStr += reader.result;
      //将字符串转为dom
      const parser = new DOMParser();
      const mainDocument = parser.parseFromString(htmlStr, 'text/html');

      //********************** */
      const header = mainDocument.querySelector('h1');
      //找到书签的根
      const root = header.nextElementSibling;
      //找到全部的书签
      const linksElements = Array.from(root.querySelectorAll('a'));
      let cnt = 0;
      const links = linksElements.map((link) => {
        let parent = link.parentNode;
        const parents = [];

        while (parent) {
          //我们可以发现，所有的文件夹都是 H3, 然后加一个 DL
          if (parent.tagName === 'DL') {
            //找到 h3 的标题
            parents.unshift('/' + parent.previousSibling.previousSibling.textContent);
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
      //console.log(links);
      //*************************
      //将数据写入table
      let td = [];
      td = change(links);
      console.log(td);
      setTableData(td.datas);
    };
    //转换links中的数据，返回书签数据集合
    let change = (links) => {
      let datas = [];
      //数据转换：将link数据转成tableData中元素
      for (let value in links) {
        //console.log(links[link]);
        let data = {
          key: links[value].key,
          name: links[value].title,
          url: links[value].href,
          dirs: links[value].dirs,
        };
        datas.push(data);
      }
      return {
        datas,
      };
    };
    console.log(options);
  };
  //
  // const React.FC = () => {
  //   const [size, setSize] = useState<SpaceSize | [SpaceSize, SpaceSize]>('small');

  return (
    <div className="App">
      <div className="uploadBnt">
        <Upload customRequest={uploadHtml}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </div>

      <Table className="Mytable" table-layout="fixed" dataSource={tableData} columns={columns} />
    </div>
  );
}

export default App;
