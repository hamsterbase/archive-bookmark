import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Table, Button, Upload } from 'antd';
import { AnalyseHtml } from './analysis-html';

import type { RcFile } from 'antd/lib/upload/interface';
import type { BookmarkLink } from './analysis-html';

import 'antd/dist/antd.css';
import styles from './App.module.css';

//定义table列
const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    render: (text: string) => {
      return (
        <div style={{ width: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
      );
    },
  },
  {
    title: '地址',
    dataIndex: 'url',
    render: (text: string) => {
      return (
        <div style={{ width: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{text}</div>
      );
    },
  },
  {
    title: '文件夹',
    dataIndex: 'dirs',
  },
];

function App() {
  const [tableData, setTableData] = useState<BookmarkLink[]>([]);

  //  自定义上传函数
  const handleUpBookmark = async (file: File) => {
    await AnalyseHtml(file)
      .then((data) => {
        setTableData(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadButton}>
        <Upload customRequest={(e) => handleUpBookmark(e.file as RcFile)} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </div>
      <Table className={styles.bookmarkInformation} table-layout="fixed" dataSource={tableData} columns={columns} />
    </div>
  );
}

export default App;
