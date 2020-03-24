import React from 'react'
import { Menu, Layout, Button,Form, Input, Checkbox, Card } from 'element-react';
// import { Input, Button, Checkbox } from 'antd';
import Bookshow from '../component/Bookshow'
import AddBookItem from '../component/AddBookItem'
import UserInfo from '../component/UserInfo'
import noContentImg from '../img/no-content.jpg'
import bookImg from '../img/book.jpg'
import book2 from '../img/book1.jpg'
import book3 from '../img/book3.jpeg'
import book4 from '../img/book4.jpg'
import './Homepage.scss'
import 'element-theme-default';
class Homepage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      noContentHint: false,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: true,
      userInfoShow: false,
      form: {
        bookName: '',
        writer: '',
        age: ''
      },
      rules: {
        libraryName: [
          { required: true, message: '请输入图书集名称', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入图书集名称'));
            } else {
              if (this.state.form.checkPass !== '') {
                this.refs.form.validateField('checkPass');
              }
              callback();
            }
          } }
        ],
      }
    }
  }

  // 图书集菜单触发

  onSelect(index,indexPath) {
    console.log(index,indexPath)
    if (index === '0') {
      this.showUserInfo();
    }else if (index === '2-2'){
      this.addLibrary();
    } else if(index === '3') {
      this.addBook();
    } else if (index === '2-1') {
      this.showBook();
    }
  }

  // 菜单激活回调。 index: 选中菜单项的 indexPath: 选中菜单项的 index path
  onOpen() {

  }
  
  // SubMenu 收起、展开的回调。 index: 打开的 subMenu 的 index， indexPath: 打开的 subMenu 的 index path
  onClose() {
  
  }

  myLibrary() {

  }
  showUserInfo() {
    this.setState({
      noContentHint:false,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: false,
      showUserInfo: true
    })
  }
  addLibrary() {
    this.setState({
      noContentHint:false,
      addLibraryOn: true,
      addBookOn: false,
      showBookOn: false,
      showUserInfo: false
    })
    console.log('...' + this.state.noContentHint)
  } 
  addBook() {
    this.setState({
      noContentHint:false,
      addLibraryOn: false,
      addBookOn: true,
      showBookOn: false,
      showUserInfo: false
    })
  }

  showBook() {
    this.setState({
      noContentHint:false,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: true,
      showUserInfo: false
    })
  }

  handleSubmit(e) {
    e.preventDefault();
    this.refs.form.validate((valid) => {
      if (valid) {
        alert('submit!');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
  }
  
  handleReset(e) {
    e.preventDefault();
  
    this.refs.form.resetFields();
  }
  
  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }

  render() {
    return (
      <div className="homepage-main">
        <div className="nav">
          {/* <Layout.Col span={6}> */}
          <Menu defaultActive="2" onSelect={this.onSelect.bind(this)} className="el-menu-vertical-demo" onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)}>
            <Menu.ItemGroup title="私人藏书管理系统" className="mainTitle">
              <Menu.Item index="0" className="userInfo">
                <div className="avatar"></div>
                Dluv
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.SubMenu index="2" title={<span><i className="el-icon-message"></i>图书集</span>}>
              <Menu.ItemGroup title="">
                <Menu.Item index="2-1">我的图书集</Menu.Item>
              </Menu.ItemGroup>
              <div className="line"></div>
              <Menu.ItemGroup>
                <Menu.Item index="2-2">添加图书集</Menu.Item>
              </Menu.ItemGroup>
              
            </Menu.SubMenu>
            <Menu.Item index="3"><i className="el-icon-menu"></i>添加图书</Menu.Item>
            <Menu.Item index="4"><i className="el-icon-setting"></i>设置</Menu.Item>
          </Menu>
          {/* </Layout.Col> */}
        </div>
        <div className="main-content">
        {
          this.state.noContentHint ? (
            <div className="no-content-hint">
              <img src={noContentImg} />
              <span>您还没有创建图书集哦!</span><br />
              <span>快去建立属于您的图书集吧!</span>
            </div>
          ) : ''
        }
        {
          this.state.addLibraryOn ? (
            <div className="content-style addLibrary">
              <h1>添加图书集</h1>

              <Form ref="form" labelPosition="top" model={this.state.form} rules={this.state.rules} labelWidth="100" className="demo-ruleForm">
                <Form.Item label="图书集名称（必填）" prop="libraryName">
                  <Input type="bookName" value={this.state.form.bookName} onChange={this.onChange.bind(this, 'bookName')} autoComplete="off" />
                </Form.Item>
                <Form.Item label="所属分类" prop="libraryType">
                  <Checkbox.Group value={this.state.form.libraryType} onChange={this.onChange.bind(this, 'libraryType')}>
                    <Checkbox label="书籍" name="libraryType"></Checkbox>
                    <Checkbox label="资料" name="libraryType"></Checkbox>
                    <Checkbox label="其他" name="libraryType"></Checkbox>
                  </Checkbox.Group>
                </Form.Item>
                <Form.Item label="存放位置" prop="location">
                  <Input value={this.state.form.location} onChange={this.onChange.bind(this, 'location')}></Input>
                </Form.Item>
                <Form.Item className="btn-group">
                  <Button type="primary" onClick={this.handleSubmit.bind(this)}>提交</Button>
                  <Button onClick={this.handleReset.bind(this)}>重置</Button>
                </Form.Item>
              </Form>
            </div>
          ) : ''
        }
        {
          this.state.addBookOn ? (
            <div className="content-style addBook">
               <h1>添加图书</h1>
              <AddBookItem />
            </div>
          ) : ''
        }
        {
          this.state.showBookOn ?
          ( <Bookshow /> ) : ''
        }
        {
          this.state.showUserInfo ?
          ( <UserInfo /> ) : ''
        }
        </div>
      </div>
    )
  }
}

export default Homepage