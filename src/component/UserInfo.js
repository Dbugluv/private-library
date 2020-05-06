import React from 'react'
import { Input, message, Upload, Modal, Button, Col,Form } from 'antd';
import { LoadingOutlined, CloudUploadOutlined} from '@ant-design/icons';
import './UserInfo.scss'
import 'element-theme-default'
import userAvatar from '../img/1.jpg'
import axios from 'axios'
import CryptoJS from 'crypto-js';
import Base64 from 'base-64';

const host = "//plms.oss-cn-shanghai.aliyuncs.com";
const accessKeyId = "LTAI4G4LC1nMTHnhn6JtD2yY";
const accessSecret = "ZwLBCKohwNOxlqnQZe3kwL78RiwmD1";
const policyText = {
  "expiration": "2028-01-01T12:00:00.000Z", // 设置该Policy的失效时间，
  "conditions": [
    ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
  ]
};
const policyBase64 = Base64.encode(JSON.stringify(policyText))
const bytes = CryptoJS.HmacSHA1(policyBase64, accessSecret, { asBytes: true });
const signature = bytes.toString(CryptoJS.enc.Base64); 
let upLoadedBook = '';

class UserInfo extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      payImgUrl: this.props.payImgUrl,
      userName: this.props.userInfo.userName,
      payImgLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('getDerivedStateFromProps', nextProps)
    if( typeof(nextProps.userInfo) === 'object'){
      this.setState({
        userName: nextProps.userInfo.userName,
        payImgUrl: nextProps.userInfo.avatar
      })
    }
  }

  beforeUpload(file) {
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

  uploadChange = ({ file }) => {
    let history = this.props.history
    if (file.status === 'uploading') {
      this.setState({ payImgLoading: true });
      return;
    }
    if (file.status === 'done') {
      let imgUrl = `https:${host}/${file.name}`
      upLoadedBook = imgUrl;
      // console.log('imgurl',imgUrl)
      this.setState({
        payImgUrl: imgUrl,
        payImgLoading: false,
      });
    }
  }
    
  submitName(e) {
    // console.log('e.trrge:',e.target.value)
    this.setState({
      userName: e.target.value
    })
  }
  updateOk() {
    const { modalOk } = this.props;
    var baseUrl = 'http://localhost:9000/userInfo/update';
    // console.log('endermodalok',this.props.userInfo.userId)
    axios.get(`${baseUrl}?userName=${this.state.userName}&avator=${this.state.payImgUrl}&userId=${this.props.userInfo.userId}`)
      .then(res => {
        console.log(res)
        if(res.status === 200 && res.data === 'success'){
          message.success('修改用户信息成功！');
          this.props.userInfoChanged();
        } else {
          message.error('修改用户信息失败！')
        }
      })
    modalOk();
  }

  render() {
    // console.log('usreInfo: ',this.props.userInfo,' name',this.state.userName,'avator', this.state.payImgUrl)
    const uploadButton = (
      <div>
        { this.state.payImgLoading ?
          <LoadingOutlined /> : <CloudUploadOutlined />
        }
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    // console.log('props', this.props)
    let {visible, updateUser, modalCancel} = this.props
    return (
      <div>
        <Modal
          className="modal"
          title="修改用户信息"
          visible={visible}
          footer={[
          <Button key={0} 
            type="primary"
            onClick={this.updateOk.bind(this)}
            style={{marginRight:'5px'}}
          >
            确定
          </Button>
          ,
          <Button key={1} onClick={modalCancel}>
            取消
          </Button>
          ]}
          updateUser={updateUser}
        >
          <Form
            name="addBook"
            ref={this.formRef} 
            labelCol={{span: 4,}}
            wrapperCol={{span: 14,}}
          >
          <Form.Item label="我的头像" name="bookCover">
            <Upload
              action={host}
              accept="image/*"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={this.beforeUpload.bind(this)}
              onChange={this.uploadChange.bind(this)}
              data={{
                key: "${filename}",
                policy: policyBase64,
                OSSAccessKeyId: accessKeyId,
                success_action_status: 200,
                signature,
              }}
            >
            {
              this.state.payImgUrl ? 
              <img src={ this.state.payImgUrl} alt="avatar" style={{ width: '100%' }} /> :
              uploadButton   
            }
            </Upload>
          </Form.Item>

          <Form.Item label="昵称" name="userName">
            <Input className="input" defaultValue="Dluv" maxLength="10" onChange={this.submitName.bind(this)}/>
          </Form.Item>
          </Form>
        

        </Modal>
      </div>
    )
  }
}

export default UserInfo