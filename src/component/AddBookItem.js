import React, { useState } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Input,
  Button,
  Checkbox,
  Col,
  Row,
  Upload, message,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
} from 'antd';

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
      plainOptions:['书籍', '资料', '其他']
    }
  }

  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }

  handleCheckChange = checkedList => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && checkedList.length < this.state.plainOptions.length,
      checkAll: checkedList.length === this.state.plainOptions.length,
    });
  };

  handleSubmit(){

  }
  handleReset(){

  }  
  onFormLayoutChange() {

  }

  getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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

  render() {
    const uploadButton = (
      <div>
        {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    return (
    <div>
      <Form
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="vertical"
      >
        <Form.Item label="书籍名称" prop="bookName">
          <Input type="bookName" value={this.state.form.bookName} onChange={this.onChange.bind(this, 'bookName')} autoComplete="off" />
        </Form.Item>
        <Form.Item label="作者" prop="writer">
          <Input type="writer" value={this.state.form.writer} onChange={this.onChange.bind(this, 'writer')} autoComplete="off" />
        </Form.Item>
        <Form.Item label="存放位置" prop="location">
          <Input value={this.state.form.location} onChange={this.onChange.bind(this, 'location')}></Input>
        </Form.Item>
        <Form.Item label="图书封面">
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            beforeUpload={this.beforeUpload.bind(this)}
            onChange={this.handleChange}
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item label="所属图书集" prop="libraryType">
          <Checkbox.Group
            options={this.state.plainOptions}
            value={this.state.checkedList}
            onChange={this.handleCheckChange.bind(this)}
          />
        </Form.Item>
        <Form.Item label="购入日期">
          <DatePicker />
        </Form.Item>
        <Row
          type="flex"
          justify="flex-start"
          gutter={24}
          style={{ marginTop: '20px' }}
        >
          <Col>
            <Form.Item>
              <Button style={{ backgroundColor: '#FFEB3B', borderColor:'#FFEB3B', color:'grey',width:'150px' }} type="primary" onClick={this.handleSubmit.bind(this)}>
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