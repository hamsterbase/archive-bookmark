import { useEffect, useState } from 'react';
import styles from './App.module.css';
import { UploadOutlined } from '@ant-design/icons';
import { Table, Button, Upload } from 'antd';
import { AnalyseHtml } from './AnalyseHtml';
import 'antd/dist/antd.css';

//定义table列
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    render: (text: string) => {
      return (
        <div style={{ width: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
      );
    },
  },
  {
    title: '地址',
    dataIndex: 'url',
    key: 'url',
    render: (text: string) => {
      return (
        <div style={{ width: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
      );
    },
  },
  {
    title: '文件夹',
    dataIndex: 'dirs',
    key: 'dirs',
  },
];

function App() {
  const [tableData, setTableData] = useState<any>([]);
  //转换links中的数据，返回书签数据集合
  const change = (links: any) => {
    let _data = [];
    //数据转换：将link数据转成tableData中元素
    for (let value in links) {
      let data = {
        key: links[value].key,
        name: links[value].title,
        url: links[value].href,
        dirs: links[value].dirs,
      };
      _data.push(data);
    }
    return _data;
  };
  //  自定义上传函数
  const uploadHtml = (options: any) => {
    const { onSuccess, onError, file, filename, onProgress, onChange } = options;
    AnalyseHtml(file)
      .then((data: any) => {
        let _data = change(data);
        setTableData(_data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles['container']}>
      <div className={styles['uploadBnt']}>
        <Upload customRequest={uploadHtml}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </div>

      <Table className={styles['mytable']} table-layout="fixed" dataSource={tableData} columns={columns} />
    </div>
  );
}

export default App;
