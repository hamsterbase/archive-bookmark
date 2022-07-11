import { useState } from "react";
import "./App.css";
import {Table  } from 'antd';
import "antd/dist/antd.css";

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
      dataIndex: 'addr',
      key: 'addr',
    },
    {
      title: '文件夹',
      dataIndex: 'folder',
      key: 'folder',
    }
  ];
  // const dataSource=[
  //   {key:"1",
  //   name:"baidu",
  //   addr:"www.baidu.com",
  //   folder:"first"
  //   }
  // ]
  var data={key:"1",
  name:"baidu",
  addr:"www.baidu.com",
  folder:"first"
  }
  let dataSource=new Array(20).fill(data);

  return (
    <div className="App">
          <Table dataSource={dataSource} columns={columns}/>
    </div>
  );
}

export default App;
