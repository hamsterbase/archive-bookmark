import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import "antd/dist/antd.css";
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {Button,Input,Table,message, Upload,Layout,Space,Popconfirm  } from 'antd';
import React from 'react';
function App() {

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
    },
  ];
  //定义标签类
  const Mylable={
    key:1,
    name:"111",
    addr:"",
    folder:""
  }
  //定义对象数组
  const arry: any[] | (() => any[])=[];
  //const dataSource=arry;
  const [Mylb, setMylb] = useState(arry);let count:any=0;
  const [dataSource,setDataSource]=useState(arry);
  const { Header, Footer, Sider, Content } = Layout;
  const uploadHtml=(options:any)=>{
    setMylb(arry);
    const { onSuccess, onError, file,filename, onProgress } = options;
    options.onProgress({percent:50});
    file.status='uploading';
  //文件转字符串
    let reader=new FileReader();
    reader.readAsText(file);
    reader.onload=()=>{
      
      //console.log(reader.result);
      let dom=reader.result;
      //匹配名字
      let domRegName=/(?<=(<title[^>]*?>)).*?(?=(<\/title>))/g;
      //匹配网址
      let domRegAddr=/(?<=(<link[^>]*?href=")).*?(?=("))/g;
      //匹配文件夹

      const titleName=dom.match(domRegName);
      const addr=dom.match(domRegAddr);

      //存入数据到state
      // Mylable.name=titleName[0];
      // Mylable.addr=addr[0];
      count=count+1
      arry.push({key:count.toString(),name:titleName[0],addr:addr[0],folder:""});
      setDataSource(arry);
      console.log("正则表达式匹配",titleName[0]);
      console.log("正则表达式匹配",addr[0]);
      console.log("匹配结束。。。",arry);
      if(titleName!=null){
        options.onProgress({percent:100});
        file.status='done';
       
      }else{
        file.status='error';
        options.onError('上传失败');
      }
    }
//onSuccess({ });

    console.log(options)
console.log(dataSource)
    // const fmData = new FormData();
    // const config = {
    //   headers: { "content-type": "multipart/form-data" },
    //   onUploadProgress: (event:any) => {
    //     onProgress({ percent: (event.loaded / event.total) * 100 });
    //   }
    // };

  }
  const setData=()=>{

  }
  return (
    <div className="App"> 
  <Layout>
      <Header id="topHeader">网页上传</Header>
      <Layout>
        <Content id="leftSider">
        <Space>
    <Upload customRequest={uploadHtml}>
      <Button>
        <UploadOutlined /> 点击上传网页
      </Button>
    </Upload>
  </Space>
        </Content>
        <br />
        <Content>   
          <Table dataSource={dataSource} columns={columns}
          rowKey={(record)=>{return (record.id+count)}}
          />
        </Content>
      </Layout>

    </Layout>

    </div>

  );
}

export default App;
