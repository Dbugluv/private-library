import React from 'react'
import axios from 'axios'
import { Form, Input, Button, Radio, Divider, message, Select } from 'antd';
import './AddLib.scss'


class AddLib extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      owenedLibOptions: ['位置','图书类别','其他'],
      checkedOwnedLibList: [],
      selectedLib: '',
      librarys: []
    }
  }
  formRef = React.createRef();

  componentDidMount() {
    this.getLibs();
  }

  onFinish = values => {
    console.log('Received values of form: ', values);
    this.addLibrary(values);
  }

  getLibs() {
    let userId = this.props.userId;
    let libs = [];
    axios.get('http://localhost:9000/library/queryALl')
     .then(
       (res) => {
        res.data.map( item => {
          // console.log('item:',item.ownerId === parseInt(userId))
          if( item.ownerId === parseInt(userId)) {
            libs.push(item);
          }
        })
        this.setState({
          librarys: Object.assign( [], this.state.librarys, libs),
          selectedLib: libs[0]  // 初始化选择默认值
        })
    })
  }

  addLibrary = values => {
    console.log('图书集：', values)
    var library = Object.assign({},values)
    var baseUrl = 'http://localhost:9000/library/add';
    axios.get(`${baseUrl}?libName=${library.libName}&libClass=${library.libClass}&libLocation=${library.location}&ownerId=${this.props.userId}`)
      .then(res => {
        if(res.status === 200 && res.data === 'success'){
          message.success('添加成功！');
        } else {
          message.error('添加失败！')
        }
      })
  }

  handleReset() {  
    this.formRef.current.resetFields();
  }

  onChange(key, value) {
  }

  selectChange(libName,value) {
    let selectedLib = {
      libName: libName,
      libId: value.key
    }
    this.setState({
      selectedLib: Object.assign({},selectedLib)
    })
  }

  delLib() {
    console.log('del->', this.state.selectedLib)
    var baseUrl = 'http://localhost:9000/library/delLib';
    this.state.selectedLib && this.state.selectedLib.libId
    && axios.get(`${baseUrl}?libId=${this.state.selectedLib.libId}`)
      .then( res => {
        console.log('ressss',typeof(res.data),res.data)
        if(res.status === 200 && res.data === 'success'){
          message.success('删除成功！');
        } else {
          // res.data.match('ER_ROW_IS_REFERENCED_2') 
          res.data.match('ER_ROW_IS_REFERENCED_2') ? 
            message.error('此图书集下已包含藏书内容，不可删除！') : message.error('删除失败！')
        }
      })
  }

  render() {
    const { Option } = Select;
    console.log('this.state.selectedLib',this.state.selectedLib)
    let selectedLib = this.state.selectedLib;
    let defaultSelectValue;
    selectedLib ? defaultSelectValue = this.state.selectedLib.libName : defaultSelectValue = '';

    return (
      <div className="content-style addLibrary">
        <h1>添加图书集</h1>

        <Form ref={this.formRef} 
          name="addLib"
          className="addLibrarys"
          layout = "vertical"
          onFinish={this.onFinish.bind(this)}>
          <Form.Item 
            name="libName"
            label="图书集名称"
            rules={[
              {
                required: true,
                message: '请输入您的图书集名称！',
              },
            ]}>
            <Input placeholder="请输入您的图书集名称" type="bookName" autoComplete="off" />
          </Form.Item>
          <Form.Item name="libClass" label="图书集划分依据"
          //  rules={[
          //   {
          //     required: true,
          //     message: '请输入您的图书集分类！',
          //   },
          // ]}
          >
            <Radio.Group
              options={this.state.owenedLibOptions}
              value={this.state.checkedOwnedLibList}
              // onChange={this.handleCheckChange.bind(this)}
            />
          </Form.Item>
          <Form.Item 
            label="存放位置"
            name="location"
            >
            <Input placeholder="请输入您图书集所处的位置" onChange={this.onChange.bind(this, 'location')}></Input>
          </Form.Item>
          <Form.Item className="btn-group">
            <Button type="primary" htmlType="submit" >提交</Button>
            <Button htmlType="reset" onClick={this.handleReset.bind(this)}>重置</Button>
          </Form.Item>
        </Form>
        <Divider />
        {
          this.state.selectedLib ? 
          (
            <div>
              <h1>删除图书集</h1>
              <Select
                showSearch
                value={this.state.selectedLib.value || defaultSelectValue}
                className="select"
                placeholder="选择你的图书集"
                optionFilterProp="children"
                onChange={this.selectChange.bind(this)}
                // onFocus={this.onFocus.bind(this)}
                // onBlur={this.onBlur.bind(this)}
                // onSearch={this.onSearch.bind(this)}
              >
              {
                this.state.librarys.map((item,index) => {
                  return (
                    <Option key={item.libId} value={item.libName}>{item.libName}</Option>
                  )
                })
              }
            </Select>
            <Button onClick={this.delLib.bind(this)}>删除</Button>
          </div>
          ) : ''
        }
        
      </div>
    );
  }
}

export default AddLib