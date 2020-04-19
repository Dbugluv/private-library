import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Col,
  Row,
  Upload, message, Icon
} from 'antd';
import { LoadingOutlined, PlusOutlined} from '@ant-design/icons';

import axios from 'axios'
import moment from 'moment';
import CryptoJS from 'crypto-js';
import Base64 from 'base-64';


const todayKey = moment().format('YYYYMMDD');
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

class AddBookItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      form: {
        bookName: '',
        writer: '',
        age: ''
      },
      checkedList: [],
      indeterminate: true,
      plainOptions:['书籍', '资料', '其他'],
      isLoad: false,
      payImgLoading: false,
      payImgUrl: ''
    }
  }
  formRef = React.createRef();

  onFinish = values => {
    // console.log('Received values of form: ', values);
    this.addBooks(values);
    // let history = this.props.history;
  }

  addBooks = values => {
    var baseUrl = 'http://localhost:9000/books/add';
    console.log(values);
    var bookInfo = Object.assign({},values)
    // ${bookInfo.ownedLibId}
    axios.get(`${baseUrl}?bookName=${bookInfo.bookName}&author=${bookInfo.author}&location=${
      bookInfo.location}&bookCover=${upLoadedBook}&ownedLibId=1&brief=${bookInfo.brief}`)
      .then(res => {
        console.log(res)
        if(res.status === 200 && res.data === 'success'){
          message.success('添加图书成功！');
        } else {
          message.error('添加图书失败！')
        }
      })
  }

  handleReset() {  
    this.formRef.current.resetFields();
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
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
  loadChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      isLoad: e.target.value,
    });
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
      console.log('imgurl',imgUrl)
      this.setState({
        payImgUrl: `${host}/${file.name}`,
        payImgLoading: false,
      });
      history.push('/hompage');
    }
  }

  render() {
    const { TextArea } = Input;
    const uploadButton = (
      <div>
        { this.state.payImgLoading ?
          <Button >等待</Button>
          // <Icon type="loading" />
          : 
          // <Icon type="plus" />
          <Button>上传</Button>
        }
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
    <div>
      <Form
        name="addBook"
        ref={this.formRef} 
        labelCol={{span: 4,}}
        wrapperCol={{span: 14,}}
        // layout="vertical"
        onFinish={this.onFinish.bind(this)}
      >
        <Form.Item label="书籍名称" name="bookName"
          rules={[
            {
              required: true,
              message: '请输入书籍名称！',
            },
          ]}>
          <Input placeholder="请输入书籍名称" autoComplete="off" />
        </Form.Item>
        <Form.Item label="作者" name="author">
          <Input autoComplete="off" />
        </Form.Item>
        <Form.Item label="是否已被借阅" name="isLoan">
          <Radio.Group onChange={this.loadChange} value={this.state.isLoad}>
            <Radio value={true}>是</Radio>
            <Radio value={false}>否</Radio>
          </Radio.Group>
        </Form.Item>
        { 
          this.state.isLoad ? 
            <Form.Item label="借阅人" name="loaner">
              <Input placeholder="请输入借阅人名称" />
            </Form.Item>
          : 
          <Form.Item label="存放位置" name="location">
            <Input placeholder="请输入书籍放置位置（参考：某市家中书柜第二层）" />
          </Form.Item>
        }
        <Form.Item label="图书封面" name="bookCover">
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
        <Form.Item label="所属图书集" name="ownedLib">
          <Radio.Group
            options={this.state.plainOptions}
            value={this.state.checkedList}
            // onChange={this.handleCheckChange.bind(this)}
          />
        </Form.Item>
        <Form.Item label="摘要" name="brief">
          <TextArea placeholder="请输入这本书的简介" autoSize={true} />
          {/* <DatePicker format="YYYY-MM-DD"/> */}
        </Form.Item>
        <Form.Item label="购入日期" name="buyTime">
          <Input placeholder="参考日期格式: YYYY-MM-DD"/>
          {/* <DatePicker format="YYYY-MM-DD"/> */}
        </Form.Item>
        <Row
          type="flex"
          justify="flex-start"
          gutter={24}
          style={{ margin: '40px 0 0 75px' }}
        >
          <Col>
            <Form.Item>
              <Button style={{ backgroundColor: '#FFEB3B', borderColor:'#FFEB3B', color:'grey',width:'150px' }} 
                type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button style={{ width:'100px', color:'grey'}} type="default" onClick={this.handleReset.bind(this)}>
                重置
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
    )
  }
}

export default AddBookItem