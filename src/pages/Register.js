import React from 'react'
import { Menu,
  //  Button,Form, Input 
  } from 'element-react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios'

import './Register.scss'
import 'element-theme-default';
class Register extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    }
  }
  formRef = React.createRef();

  addUser(value) {
    var baseUrl = 'http://localhost:9000/userInfo/add';
    console.log(value);
    var userInfo = Object.assign({},value)
    axios.get(`${baseUrl}?userNumber=${userInfo.userNumber}&userName=${userInfo.userName}&password=${userInfo.password}`)
        .then(res => {
          if(res.status === 200 && res.data === 'success'){
            message.success('注册成功！');
          } else {
            message.error('注册失败！')
          }
        })
  }

  componentDidMount() {
    axios.get('http://localhost:3000/api/userInfo')
    .then((res) => {
      console.log('?!affwafafafafawf',res)
      let user = res.data
      this.setState({
        userList: user
      })
    })
  }

  onSelect() {
    console.log('...')
  }

  handleReset() {
    this.formRef.current.resetFields();
  }

  isExist(values) {
    let exist =  this.state.userList.some( user => {
      console.log('?????',user.userNumber === parseInt(values.userNumber))
      return user.userNumber === parseInt(values.userNumber)
    })
    
    if(exist) {
      message.error('该用户已存在!')
      this.handleReset();
    }
    
    return exist;
  }

  onFinish = values => {
    console.log('Received values of form: ', values);
    let history = this.props.history;
    let exist = this.isExist(values);
    !exist && this.addUser(values)
    !exist && history.push('/homepage');
  }

  render() {
    return (
      <div className="main">
        <div className="main__bg"></div>
        <div className="header">
          <span className="title">私人藏书管理系统</span>
          <Menu defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={this.onSelect.bind(this)}>
            <Menu.Item index="1">注册</Menu.Item>
            <Menu.Item index="2">关于</Menu.Item>
            <Menu.Item index="3">帮助</Menu.Item>
          </Menu>
        </div>

        <div className="registerHint">
          <h1>Welcome to your personal library system</h1>
          随时为您服务
        </div>
       
        <div className="content">
          <Form 
            ref={this.formRef}
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={this.onFinish.bind(this)}
          >
            <Form.Item
              name="userNumber"
              label="账号"
              rules={[ {pattern: /^\d*$/, message: '请输入数字',required: true} ]}
            >
              <Input placeholder="请输入您的帐号（最好以手机号为准）" />
            </Form.Item>
            <Form.Item
              name="userName"
              label="昵称"
              rules={[ {required: true} ]}
            >
              <Input placeholder="请输入您的用户昵称" />
            </Form.Item>
            <Form.Item
              name="password"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码！',
                },
              ]}
            >
              <Input
                type="password"
                placeholder="请输入您的密码"
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                注册
              </Button>
              <Button type="primary" htmlType="reset" onClick={this.handleReset.bind(this)} className="login-form-button">
                重置
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    )
  }
}

export default Register