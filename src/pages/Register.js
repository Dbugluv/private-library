import React from 'react'
import { Menu, Button,Form, Input } from 'element-react';
import './Register.scss'
import 'element-theme-default';
class Register extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      form: {
        pass: '',
        checkPass: '',
        age: ''
      },
      rules: {
        pass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              if (this.state.form.checkPass !== '') {
                this.refs.form.validateField('checkPass');
              }
              callback();
            }
          } }
        ]
      }
    };
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
  
  onSelect() {
    console.log('...')
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
          <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="100" className="demo-ruleForm">
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
          </Form>
        </div>
      </div>
    )
  }
}

export default Register