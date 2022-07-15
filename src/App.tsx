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
      dataIndex: 'folder',
      key: 'folder',
    },
  ];
  //模拟数据
  const data = { key: '1', name: 'baidu', url: 'www.baidu.com', folder: 'first' };
  //填充table表
  const dataSource = new Array(1).fill(data);
  //  自定义上传函数
  const uploadHtml = (options: any) => {
    const { onSuccess, onError, file, filename, onProgress } = options;
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
      //获取title
      console.log(mainDocument.title);
      data.name = mainDocument.title;
      //url(有问题)
      console.log(mainDocument.URL);
      data.url = mainDocument.URL;
      //文件夹名（有问题）
      //存入数组
      Datalist.push(data);
    };
    console.log(Datalist);
  };
  return (
    <div className="App">
      <Upload customRequest={uploadHtml}>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default App;
