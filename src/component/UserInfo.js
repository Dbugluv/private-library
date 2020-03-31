import React from 'react'
import { Input, message, Button, Modal, Row, Col } from 'antd';
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
    }
  }
  
  submitName() {

  }
  render() {
    
    console.log('props', this.props)
    let {visible, modalOk, modalCancel} = this.props
    return (
      <div>
        <Modal
          className="modal"
          title="修改用户信息"
          visible={visible}
          onOk={modalOk}
          onCancel={modalCancel}
        >
        <Row>
          <Col>
            <div className="avatar">
              <img src={userAvatar}/>
            </div>
          </Col>
          <Col>
            <Button className="button">修改头像</Button>
          </Col>
        </Row>
        
        <span className="nameLabel">昵称</span> <Input className="input" defaultValue="Dluv" maxLength="10" onPressEnter={this.submitName}/>

        </Modal>
      </div>
    )
  }
}

export default UserInfo