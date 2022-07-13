import { useState } from 'react';
import './App.css';
import { UploadOutlined } from '@ant-design/icons';
import { Table, Button, Upload } from 'antd';
import 'antd/dist/antd.css';

function App() {
  const [count, setCount] = useState(0);
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
  const data = { key: '1', name: 'baidu', url: 'www.baidu.com', folder: 'first' };
  const dataSource = new Array(20).fill(data);

  return (
    <div className="App">
      <Upload>
        <Button icon={<UploadOutlined />}>Click to Upload</Button>
      </Upload>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
}

export default App;
