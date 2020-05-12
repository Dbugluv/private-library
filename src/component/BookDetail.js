import React from 'react';
// import { Icon } from 'element-react';
import { Divider, Input, message, List, Button, 
  Tooltip, Modal, Slider, InputNumber, Row, Col, Form, Radio, Upload
} from 'antd';
import { EditOutlined, FormOutlined, DeleteOutlined, EnterOutlined, WalletOutlined, LoadingOutlined, CloudUploadOutlined } from '@ant-design/icons';
import axios from 'axios'
import './BookDetail.scss'
import CryptoJS from 'crypto-js';
import Base64 from 'base-64';
import defaultBookCover from '../img/default.jpg'
const { TextArea } = Input;
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

class BookDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      excerptShow: false,
      modalVisible: false,
      inputValue: this.props.bookInfo.progress,
      isLoan: this.props.bookInfo.isLoan,
      excerptModalVisible: false,
      brief: ''
    }
    let editIcon = <Tooltip placement="rightTop" title="编辑信息"><EditOutlined className={this.state.eidt ? 'clickItem' : ''} /></Tooltip>
    let excerptIcon = <Tooltip placement="rightTop" title="添加摘录"><FormOutlined /></Tooltip>
    let delIcon = <Tooltip placement="rightTop" title="删除此图书"><DeleteOutlined /></Tooltip>
    let excerptListIcon = <Tooltip placement="rightTop" title="查看摘录集"><WalletOutlined /></Tooltip>
    this.menuLists = [
      editIcon,
      excerptIcon,
      excerptListIcon,
      delIcon,
    ]
    // this.bookId = this.props.bookInfo.bookId;
  }

  componentDidMount() {
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
    }
  }

  delBook(id) {
    // console.log('thisbokkid',id)
    var baseUrl = 'http://localhost:9000/books/del';
    axios.get(`${baseUrl}?bookId=${id}`)
      .then( res => {
        if(res.status === 200 && res.data === 'success'){
          message.success('删除图书成功！');
          this.setState({
            modalVisible: false
          })
          this.props.bookChanged();
        } else {
          message.error('删除图书失败')
        }
      })
  }

  RightMenu(index,id) {
    switch(index) {
      case 0: // 编辑
        console.log('bookdetail: ',this.props.bookInfo)
        !this.state.excerptShow &&
        this.setState({
          edit: !this.state.edit
        })
        break;
      case 1: // 添加摘录
        !this.state.edit &&
        this.setState({
          excerptShow: true
        });
        break;
      case 2: // 查看摘录集
        this.setState({
          excerptModalVisible: true
        })
        break;
      case 3: // 删除图书
        this.setState({
          modalVisible: true
        })
        break;
      default:
        break;
    }
  }

  briefConfirm(e) {
    this.setState({
      brief: e.target.value
    })
  }

  excerptConfirm(e) {
    let excerpt = e.target.value;
    var baseUrl = 'http://localhost:9000/books/updateExcerpt';
    axios.get(`${baseUrl}?excerpt=${excerpt}&bookId=${this.props.bookInfo.bookId}`)
      .then( res => {
        if(res && res.data === 'success'){
          this.setState({
            excerptShow: false
          })
          message.success('图书摘录添加成功');
          this.props.bookChanged();
        } else {
          // console.log(res);
          message.error('图书摘录添加失败')
        }
      })
  }

  editOk() {

  }
  modalCancel() {
    this.setState({
      modalVisible: false,
      excerptModalVisible: false
    });
  }
  
  progressChange = value => {
    this.setState({
      inputValue: value,
    });
  };

  loadChange = e => {
    console.log('radio checked', e.target.value);
    this.setState({
      isLoan: e.target.value,
    });
  }

  handleReset() {  
    this.formRef.current.resetFields();
  }
  

  onFinish = values => {
    console.log('Received values of form: ', values);
    this.updateBooks(values);
    // this.upDateBooks(values);
    // let history = this.props.history;
  }

  updateBooks = values => {
    var baseUrl = 'http://localhost:9000/books/updateBook';
    console.log(values);
    var bookInfo = Object.assign({},values)
    bookInfo.ownedLibId = 1;
    // bookInfo.isLoan === '1' ? bookInfo.location = '' : bookInfo.loaner = '';  //  保持互斥。
    axios.get(`${baseUrl}?bookName=${bookInfo.bookName}&author=${bookInfo.author}&location=${bookInfo.location
      }&brief=${bookInfo.brief}&progress=${this.state.inputValue}&bookId=${this.props.bookInfo.bookId}`)
      .then(res => {
        console.log(res)
        if(res.status === 200 && res.data === 'success'){
          message.success('修改图书成功！');
          this.setState({
            edit: !this.state.edit
          })
          this.props.bookChanged();
        } else {
          message.error('修改图书失败！')
        }
      })
  }
  cancel() {
    this.setState({
      edit: !this.state.edit
    })
  }

  render() {
    let bookInfo = this.props.bookInfo;
    const { inputValue } = this.state;
    const uploadButton = (
      <div>
        { this.state.payImgLoading ?
          <LoadingOutlined /> : <CloudUploadOutlined />
        }
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
    <div style={{display: 'inline'}}>
       <Modal
          title="提示"
          visible={this.state.modalVisible}
          onOk={this.delBook.bind(this,bookInfo.bookId)}
          onCancel={this.modalCancel.bind(this)}
        >
          <p>确定要删除这本书吗？</p>
      </Modal>
      <Modal
          title="摘录集"
          visible={this.state.excerptModalVisible}
          // onOk={this.delBook.bind(this,bookInfo.bookId)}
          onCancel={this.modalCancel.bind(this)}
        >
          <p>{bookInfo.excerpt}</p>
      </Modal>
      <div className="single-book-detail">
        <div className="imagecover">
          <img src={bookInfo.bookCover || defaultBookCover} />
        </div>
        <div className="single-book-info">
          {
            !this.state.edit ?
            <div>
              <span className="bookName">「{bookInfo.bookName}」</span><br/>
              <span className="author">author：{bookInfo.author}</span><br/>
              <span className="buyTime">购入时间：{bookInfo.buyTime}</span><br/>
              <Divider />
              <p className="brief">摘要：{bookInfo.brief !== undefined && bookInfo.brief}</p>
              <span className="location">存放位置：{bookInfo.location}</span>
              <br/><span className="progress">阅读进度：{bookInfo.progress}</span>
              <Divider />
            </div>
            : //  编辑区域
            <Form
              className="editBook"
              name="editBook"
              layout="horizontal"
              ref={this.formRef} 
              initialValues={bookInfo}
              onFinish={this.onFinish.bind(this)}
            >
              {/* <Form.Item label="图书封面" name="bookCover">
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
              </Form.Item> */}
              <Form.Item className="editItem" label="书籍名称" name="bookName"
                rules={[
                  {
                    required: true,
                    message: '请输入书籍名称！',
                  },
                ]}>
                  
                <Input placeholder="请输入书籍名称" value={bookInfo.bookName}/*  defaultValue={bookInfo.bookName} */ autoComplete="off" />
              </Form.Item>
              <Form.Item className="editItem" label="作者" name="author">
                <Input autoComplete="off" value={bookInfo.author} defaultValue={bookInfo.author} />
              </Form.Item>
              {/* <Form.Item className="editItem" label="是否已被借阅" name='isLoan'>
                <Radio.Group onChange={this.loadChange} style={{fontSize:'12px'}}>
                  <Radio style={{fontSize:'12px'}} value={'1'}>是</Radio>
                  <Radio style={{fontSize:'12px'}} value={'0'}>否</Radio>
                </Radio.Group>
              </Form.Item> */}
              {/* { 
                this.state.isLoan === '1' ?
                  <Form.Item className="editItem" label="借阅人" name="loaner">
                    <Input placeholder="请输入借阅人名称" defaultValue={bookInfo.loaner}/>
                  </Form.Item>
                :  */}
                <Form.Item className="editItem" label="存放位置" name="location">
                  <Input placeholder="请输入书籍放置位置（参考：某市家中书柜第二层）" defaultValue={bookInfo.location} />
                </Form.Item>
              {/* } */}
              <Form.Item className="editItem" label="阅读进度">
                <Row>
                  <Col span={12}>
                    <Slider min={0} max={100} onChange={this.progressChange.bind(this)} defaultValue={bookInfo.progress}
                      value={ inputValue }
                    />
                  </Col>
                  <Col span={4}>
                    <InputNumber min={0} max={100} style={{ margin: '0 16px' }}
                      value={inputValue} onChange={this.progressChange.bind(this)}
                    />
                  </Col>
                </Row>
              </Form.Item>
              <Divider />
              <Form.Item  className="editItem" label="摘要" name="brief">
                <TextArea
                  name="brief"
                  // defaultValue={ bookInfo.brief }
                  onChange={this.briefConfirm.bind(this)}
                  style={{width:'380px',backgroundColor:'whitesmoke'}}
                  placeholder="输入摘要"
                  autoSize={{ minRows: 3, maxRows: 10 }}
                />
              </Form.Item>
              <Form.Item className="editItem button">
                <Button style={{ backgroundColor: 'rgb(170,18,73)', borderColor:'#bb5e4e', color:'white',width:'80px' }} 
                  type="primary" htmlType="submit">
                  提交
                </Button>
                <Button onClick={this.cancel.bind(this)} style={{ backgroundColor: 'rgb(170,18,73)', borderColor:'#bb5e4e', color:'white',width:'80px' }}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          }
          {//摘录
            this.state.excerptShow ? 
              <TextArea
                defaultValue={bookInfo.excerpt}
                onPressEnter={this.excerptConfirm.bind(this)}
                // onChange={this.briefChange.bind(this)}
                placeholder="输入摘录 (回车提交) "
                autoSize={{ minRows: 3, maxRows: 10 }}
              /> : ''
          }
        </div>
        {
          this.state.edit ? 
            <span className="editConfirm">
              {/* <Button onClick={this.editOk}
                style={{width:'32px',height:'32px',borderRadius:'32px'}} type="primary">
                <span style={{fontSize:'10px',margin:'-10px 0 0 -12px'}}>save</span>
              </Button>  */}
            </span> : ''
        }
        <div className="tools">
          {/* <ul style={{listStyleType:'none'}} className="right-menu">
            <li onClick={this.RightMenu.bind(this,0,this.bookId)} className={this.state.eidt ? 'clickItem' : ''}><Tooltip placement="rightTop" title="编辑信息"><EditOutlined /></Tooltip></li>
            <li onClick={this.RightMenu.bind(this,1,this.bookId)}><Tooltip placement="rightTop" title="添加摘录"><FormOutlined /></Tooltip></li>
            <li onClick={this.RightMenu.bind(this,2,this.bookId)}><Tooltip placement="rightTop" title="删除此图书"><DeleteOutlined /></Tooltip></li>
            <li onClick={this.RightMenu.bind(this,3,this.bookId)}><Tooltip placement="rightTop" title="查看摘录集"><WalletOutlined /></Tooltip></li>
          </ul> */}
          <List
            size="small"
            className="right-menu"
            dataSource={this.menuLists}
            renderItem={(item,index) => <List.Item onClick={this.RightMenu.bind(this,index,this.bookId)}>{item}</List.Item>}
          />
        </div>
      </div>
    </div>
    );
  }
}

export default BookDetail