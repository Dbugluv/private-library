import React from 'react'
import axios from 'axios'
import { Menu } from 'element-react'
import { Form, Input, Button, message } from 'antd';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './Login.scss'
import 'element-theme-default'
import { getTodoList } from '../api/todo';
import Register from './Register'

class Login extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      registerOn: false,
      userInfo: []
    };
  }
  formRef = React.createRef();

  componentDidMount() {
    axios.get('http://localhost:3000/api/userInfo')
    .then((res) => {
      let user = res.data
      console.log('let ',user)
      this.setState({
        userInfo: user
      })
    })
  }

  componentDidUpdate() {
    console.log('user: ',this.state.userInfo)
  }

  loginError = () => {
    message.error('密码或账号输入错误！');
  };
  loginsuccess = () => {
    message.success('登陆成功！');
  };

  handleReset() {
    this.formRef.current.resetFields();
  }

  onFinish = values => {
    console.log('Received values of form: ', values);
    let users = this.state.userInfo;
    for( var i = 0; i < users.length; i++){
      if(values.userNumber == users[i].userNumber && values.password == users[i].password){
        // console.log('登陆成功');
        this.loginsuccess();
        let history = this.props.history
        history.push('/homepage')
        break ;
      }
    }
    if(i === users.length){
      console.log('false!')
      this.loginError();
    }

  };
  
  onSelect() {
    console.log('...')
  }

  registerChange() {
    let history = this.props.history;
    history.push('/register');
  }

  render() {

    return (
      <div className="main">
        <div className="main__bg"></div>
        <div className="header">
          <span className="title">私人藏书管理系统</span>
          <Menu defaultActive="1" className="el-menu-demo" mode="horizontal" onSelect={this.onSelect.bind(this)}>
            <Menu.Item index="1">登陆</Menu.Item>
            <Menu.Item index="2">关于</Menu.Item>
            <Menu.Item index="3">帮助</Menu.Item>
          </Menu>
        </div>
        <div className="content">
          {
           this.state.registerOn?
            (<div>
              <h1>Welcome to your personal library system</h1>
              <p>随时为您服务</p>
              <Register />
            </div> 
            )
          :
          (<Form 
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
              <Input placeholder="userNumber" />
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
                placeholder="Password"
              />
            </Form.Item>
            {/* <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
      
              <a className="login-form-forgot" href="">
                忘记密码
              </a>
            </Form.Item> */}
            <Form.Item>
              <a className="link" href="" onClick={this.registerChange.bind(this)}>还未注册，前往注册。</a>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">
                登陆
              </Button>
              <Button type="primary" htmlType="reset" onClick={this.handleReset.bind(this)} className="login-form-button">
                重置
              </Button>
            </Form.Item>
          </Form>
          )
        }
        </div>
      </div>
    )
  }
}

export default Login
