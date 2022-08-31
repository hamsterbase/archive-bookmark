import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Table, Button, Upload, Input, Form, Space, message } from 'antd';
import { AnalyseHtml } from './analysis-html';
import type { RcFile } from 'antd/lib/upload/interface';
import type { BookmarkLink } from './analysis-html';
import 'antd/dist/antd.css';
import styles from './App.module.css';

interface IData {
  bookmarksDir: string;
  chrome: string | undefined;
  [key: string]: any;
}
function App() {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<BookmarkLink[]>([]);
  const [data, setData] = useState<IData>();
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
  const onFinish = (e: any) => {
    if (e.url) {
      fetch('/api/v1/config', {
        method: 'PATCH',
        body: JSON.stringify({
          chrome: e.url,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          message.success('提交成功');
          form.setFieldsValue({
            url: null,
          });
        });
    }
  };

  const getInfo = () => {
    fetch('/api/v1/config', { method: 'GET' })
      .then((res) => res.json())
      .then((res) => {
        setData(res?.data);
        message.success('获取成功');
      });
  };
  const saveHtml = (url: string) => {
    fetch('/api/v1/save', {
      method: 'POST',
      body: JSON.stringify({
        saveUrl: url,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        message.success('保存成功');
      });
  };
  //定义table列
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (text: string) => {
        return (
          <div style={{ width: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </div>
        );
      },
    },
    {
      title: '地址',
      dataIndex: 'url',
      render: (text: string) => {
        return (
          <div style={{ width: '230px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {text}
          </div>
        );
      },
    },
    {
      title: '文件夹',
      dataIndex: 'dirs',
      render: (text: string[]) => {
        return text.join('/') || '-';
      },
    },
    {
      title: '保存网页',
      dataIndex: 'dirs',
      render: (text: string, record: Record<string, string>, index: number) => {
        return (
          <Button type="primary" onClick={() => saveHtml(record.url)}>
            保存
          </Button>
        );
      },
    },
  ];
  return (
    <div className={styles.container}>
      <div className={styles.uploadButton}>
        <Upload customRequest={(e) => handleUpBookmark(e.file as RcFile)} showUploadList={false}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item name="url" label="URL" rules={[{ required: true, message: '请填写您的chrome地址' }]}>
            <Input placeholder="请填写您的chrome地址" />
          </Form.Item>
          <Form.Item label="bookmarksDir 地址">
            <Input value={data?.bookmarksDir} disabled />
          </Form.Item>
          <Form.Item label="chrome 地址">
            <Input value={data?.chrome} disabled />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={getInfo}>获取信息</Button>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
      <Table className={styles.bookmarkInformation} table-layout="fixed" dataSource={tableData} columns={columns} />
    </div>
  );
}

export default App;
