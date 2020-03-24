import React from 'react'
import { Upload, message, Button } from 'antd';
import { UploadOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './UserInfo.scss'
import 'element-theme-default'
import userAvatar from '../img/1.jpg'

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
class UserInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      avatar: userAvatar
    }
  }

  render() {
    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      beforeUpload: beforeUpload,
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };

    return (
      <div className="content-style">
        <div className="avatar">
          <img src={userAvatar} />
          <Upload {...props}>
            <Button>
              更改头像
            </Button>
          </Upload>
        </div>
        <span className="userName">Dluv</span>

      </div>
    )
  }
}

export default UserInfo