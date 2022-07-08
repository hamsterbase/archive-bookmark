import React from 'react'
import { UploadOutlined } from '@ant-design/icons';
import {Upload,Button,UploadProps}from 'antd';
function MyUpload() {
  return (
    <Upload>
    <Button>
      <UploadOutlined /> 点击上传网页
    </Button>
  </Upload>
  )
}

export default MyUpload