import React from 'react'
import { Menu,
  //  Button,Form, Input 
  } from 'element-react';
import { Form, Input, Button, message } from 'antd';

import './Register.scss'
import 'element-theme-default';
class Register extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
    //   form: {
    //     pass: '',
    //     checkPass: '',
    //     age: ''
    //   },
    //   rules: {
    //     pass: [
    //       { required: true, message: '请输入密码', trigger: 'blur' },
    //       { validator: (rule, value, callback) => {
    //         if (value === '') {
    //           callback(new Error('请输入密码'));
    //         } else {
    //           if (this.state.form.checkPass !== '') {
    //             this.refs.form.validateField('checkPass');
    //           }
    //           callback();
    //         }
    //       } }
    //     ]
    //   }
    // };
    }
  }
  formRef = React.createRef();

  // handleSubmit(e) {
  //   e.preventDefault();
  
  //   this.refs.form.validate((valid) => {
  //     if (valid) {
  //       alert('submit!');
  //     } else {
  //       console.log('error submit!!');
  //       return false;
  //     }
  //   });
  // }
  
  // handleReset(e) {
  //   e.preventDefault();
  
  //   this.refs.form.resetFields();
  // }
  
  // onChange(key, value) {
  //   this.setState({
  //     form: Object.assign({}, this.state.form, { [key]: value })
  //   });
  // }
  
  onSelect() {
    console.log('...')
  }


  registerSuccess = () => {
    message.success('注册成功！');
  }

  handleReset() {
    this.formRef.current.resetFields();
  }

  onFinish = values => {
    console.log('Received values of form: ', values);  
    this.registerSuccess();
    let history = this.props.history
    history.push('/homepage')
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
          {/* <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="100" className="demo-ruleForm">
            <Form.Item label="账号" prop="id">
              <Input value={this.state.form.id} placeholder="请输入账号" onChange={this.onChange.bind(this, 'id')}></Input>
            </Form.Item>
            <Form.Item label="密码" prop="pass">
              <Input type="password" placeholder="请输入密码" value={this.state.form.pass} onChange={this.onChange.bind(this, 'pass')} autoComplete="off" />
            </Form.Item>
            <Form.Item className="btn-group">
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>登陆</Button>
              <Button onClick={this.handleReset.bind(this)}>重置</Button>
            </Form.Item>
          </Form> */}
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
              <Input placeholder="userNumber" />
            </Form.Item>
            <Form.Item
              name="userName"
              label="昵称"
              rules={[ {required: true} ]}
            >
              <Input placeholder="userName" />
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