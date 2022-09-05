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
}
interface IBatchUploadUrl {
  url: string;
  name: string;
  key: React.Key;
}
function App() {
  const [form] = Form.useForm();
  const [tableData, setTableData] = useState<BookmarkLink[]>([]);
  const [data, setData] = useState<IData>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [batchUploadUrl, setBatchUploadUrl] = useState<IBatchUploadUrl[]>([]);
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
  const saveHtml = (value: IBatchUploadUrl[]) => {
    if (selectedRowKeys.length === 0) {
      message.error('请先选择');
      return;
    }
    if (value.length <= 5) {
      setUploadLoading(true);
      let count = 0;
      value.forEach((item) => {
        fetch('/api/v1/save', {
          method: 'POST',
          body: JSON.stringify({
            url: item.url,
            name: item.name,
          }),
        })
          .then((res) => res.json())
          .then((res) => {
            count++;
            message.success('保存成功');
            if (res.code === 200) {
              setSelectedRowKeys((pre) => {
                return pre.filter((key) => key !== item.key);
              });
            }
            if (count === value.length) {
              setSelectedRowKeys([]);
              setUploadLoading(false);
            }
          })
          .catch((err) => {
            message.error(err.message);
            setUploadLoading(false);
          })
          .finally(() => {
            setUploadLoading(false);
          });
      });
    }
    // 如果长度大于5，就提示一下
    if (value.length > 5) {
      message.error('一次最多只能保存5个');
    }
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
    // {
    //   title: '保存网页',
    //   dataIndex: 'dirs',
    //   render: (text: string, record: BookmarkLink, index: number) => {
    //     return (
    //       <Button type="primary" onClick={() => saveHtml([record])}>
    //         保存
    //       </Button>
    //     );
    //   },
    // },
  ];

  const start = () => {
    setLoading(true);
    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: BookmarkLink[]) => {
    setBatchUploadUrl(selectedRows as IBatchUploadUrl[]);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const hasSelected = selectedRowKeys.length > 0;
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className={styles.container}>
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
      <div className={styles.uploadButton}>
        <Upload customRequest={(e) => handleUpBookmark(e.file as RcFile)} showUploadList={false}>
          <Button icon={<UploadOutlined />}>上传书签</Button>
        </Upload>
      </div>
      <div className={styles.uploadButton}>
        <Space>
          <Button type="primary" onClick={start} disabled={!hasSelected} loading={loading}>
            Reload
          </Button>
          <Button
            type="primary"
            disabled={selectedRowKeys.length === 0}
            onClick={() => saveHtml(batchUploadUrl)}
            loading={uploadLoading}
          >
            批量下载 {hasSelected ? `（${selectedRowKeys.length}/5）` : ''}
          </Button>
        </Space>
      </div>
      <Table
        rowSelection={rowSelection}
        className={styles.bookmarkInformation}
        table-layout="fixed"
        dataSource={tableData}
        columns={columns}
      />
    </div>
  );
}

export default App;
