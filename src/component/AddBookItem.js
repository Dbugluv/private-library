import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Radio,
  Col,
  Row,
  Upload, message, DatePicker, Slider, InputNumber
} from 'antd';
import { LoadingOutlined, CloudUploadOutlined} from '@ant-design/icons';
import moment from 'moment';
import axios from 'axios'
import CryptoJS from 'crypto-js';
import Base64 from 'base-64';
import locale from 'antd/es/date-picker/locale/zh_CN';
import 'moment/locale/zh-cn';
import noContentImg from '../img/no-content.jpg'

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
      selectTime: '',
      indeterminate: true,
      librarys: [],
      bookTypeOptions:['小说', '诗歌', '散文', '哲理', '历史', '其他'],
      checkedBookTypeList: [],
      owenedLibOptions: [],
      checkedOwnedLibList: [],
      isLoan: 0,
      payImgLoading: false,
      payImgUrl: '',
      inputValue: 0,
      noLibHint: false
    }
    // this.selectTime = '';
  }
  formRef = React.createRef();

  componentDidMount() {
    this.getLibs();
    // this.state.librarys.map( index => {
    //   // console.log('options:',index)
    //   let options = [];
    //   options[index.libId] = index.libName
    //   this.setState({
    //     owenedLibOptions: Object.assign( [] , this.state.owenedLibOptions, options)
    //   })
    // })
  }
  onFinish = values => {
    console.log('form: ', values);
    this.addBooks(values);
    // let history = this.props.history;
  }

  addBooks = values => {
    var baseUrl = 'http://localhost:9000/books/add';
    let ownenLib = this.state.librarys.filter( item => {    // 拿取选中图书集的id。
        return (item.libName === values.ownedLib);
    })
    var bookInfo = Object.assign({},values)
    // let isLoan = this.state.isLoan;
    bookInfo.ownedLibId = 1;
    axios.get(`${baseUrl}?bookName=${bookInfo.bookName}&author=${bookInfo.author}&location=${
      bookInfo.location}&bookCover=${upLoadedBook}&ownedLibId=${ownenLib.libId}&brief=${bookInfo.brief}&buyTime=${
      this.state.selectTime}&bookType=${bookInfo.bookType}&progress=${this.state.inputValue}`)
      .then(res => {
        console.log(res)
        if(res.status === 200 && res.data === 'success'){
          message.success('添加图书成功！');
        } else {
          message.error('添加图书失败！')
        }
      })
  }

  getLibs() {
    axios.get('http://localhost:3000/api/librarys')
    .then(
      (res) => {
        // console.log('res:',res.data)
        let options = [], optionKeys = [];
        res.data.map( index => {
          options[index.libId] = index.libName
        })
        if(res.data){
          this.setState({
            librarys: Object.assign( [], this.state.librarys, res.data),
            owenedLibOptions: Object.assign( [], this.state.owenedLibOptions, options),
            checkedOwnedLibList: res.data[0].libName  // 初始化选择默认值
          })
        } else {
          this.setState({
            noLibHint: true
          })
        }        
    })
  }

  timeChange(value, dateString) {
    console.log('Formatted Selected Time: ', dateString);
    this.setState({
      selectTime: dateString
    })
    // this.selectTime = Object.assign({},this.selectTime,dateString);
  }

  disabledDate(cur) {
    // console.log('thismonth',cur)
    return cur > new Date().getTime();
  }
  handleReset() {  
    this.formRef.current.resetFields();
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
      isLoan: e.target.value,
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
  
  progressChange = value => {
    this.setState({
      inputValue: value,
    });
  };

  handleCheckChange(e) {
    let id = this.state.librarys.indexOf(e.target.value);
    // console.log('rrrr',e.target,'this.state.librarys:',this.state.librarys,'id',id);
  }

  render() {
    const { TextArea } = Input;
    const uploadButton = (
      <div>
        { this.state.payImgLoading ?
          <LoadingOutlined /> : <CloudUploadOutlined />
        }
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { inputValue } = this.state;
    console.log('this.state',this.state.owenedLibOptions)
    
    return (
    <div>
      {
        this.state.noLibHint ?
          <div className="no-content-hint">
          <img src={noContentImg} />
          <span>您还没有创建图书集哦!</span><br />
          <span>快去建立属于您的图书集吧!</span>
        </div>
        :
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
        <Form.Item label="文学体裁" name="bookType">
          <Radio.Group
              options={this.state.bookTypeOptions}
              value={this.state.checkedBookTypeList}
              // onChange={this.handleCheckChange.bind(this)}
            /> 
        </Form.Item>
        <Form.Item label="所属图书集" name="ownedLib">
          <Radio.Group
            options={this.state.owenedLibOptions}
            value={this.state.checkedOwnedLibList}
            onChange={this.handleCheckChange.bind(this)}
          />
        </Form.Item>
        {/* <Form.Item label="是否已被借阅">
          <Radio.Group onChange={this.loadChange.bind(this)} value={isLoan} defaultValue={1}>
            <Radio value={1} >是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item> */}
        { 
          // this.state.isLoan ? 
          //   <Form.Item label="借阅人" name="loaner">
          //     <Input placeholder="请输入借阅人名称" />
          //   </Form.Item>
          // : 
          <Form.Item label="存放位置" name="location">
            <Input placeholder="请输入书籍放置位置（参考：某市家中书柜第二层）" />
          </Form.Item>
        }
        <Form.Item label="阅读进度" name="progress">
          <Row>
            <Col span={12}>
              <Slider min={0} max={100} onChange={this.progressChange.bind(this)}
                value={typeof inputValue === 'number' ? inputValue : 0}
              />
            </Col>
            <Col span={4}>
              <InputNumber min={0} max={100} style={{ margin: '0 16px' }}
                value={inputValue} onChange={this.progressChange.bind(this)}
              />
            </Col>
          </Row>
        </Form.Item>
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
        <Form.Item label="摘要" name="brief">
          <TextArea placeholder="请输入这本书的简介" autoSize={true} />
          {/* <DatePicker format="YYYY-MM-DD"/> */}
        </Form.Item>
        <Form.Item label="购入日期" name="buyTime">
          <DatePicker onChange={this.timeChange.bind(this)} locale={locale} 
            format="YYYY/MM" picker="month" disabledDate={this.disabledDate}/>
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
      }
    </div>
    )
  }
}

export default AddBookItem