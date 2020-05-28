import React from 'react'
import { Menu, /* Button,Form, Input, Checkbox, */ Card } from 'element-react';
import { Form, Input, Button, message, Radio, Popover, Icon} from 'antd';
import {BarChartOutlined, ReadOutlined, FileAddOutlined, SettingOutlined, FormOutlined } from '@ant-design/icons';

// import { Input, Button, Checkbox } from 'antd';
import Bookshow from '../component/Bookshow'
import Excerpt from '../component/Excerpt'
import AddBookItem from '../component/AddBookItem'
import UserInfo from '../component/UserInfo'
import noContentImg from '../img/no-content.jpg'
import './Homepage.scss'
import 'element-theme-default';
import axios from 'axios';
import LibData from '../component/LibData';
import AddLib from '../component/AddLib';
const defaultAvatar = 'https://plms.oss-cn-shanghai.aliyuncs.com/defaultAva.jpg'


class Homepage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      noLibHint: true,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: true,
      showUserInfo: false,
      visible: false,
      excerptShow: false,
      owenedLibOptions: ['位置','图书类别','其他'],
      checkedOwnedLibList: [],
      loginUser: '',
      payImgUrl: '',
      libDataShow: false,
      libs: [],
    }
    this.userId = this.props.match.params.userId
  }
  formRef = React.createRef();


  componentDidMount() {
    this.getUserInfo();
    this.getLibs();
  }
  
  componentWillReceiveProps(nextProps) {
    this.state.libs && this.setState({
      noLibHint: false
    })
  }
  getUserInfo() {
    var baseUrl = 'http://localhost:9000/userInfo/getOne';
    // console.log('usserid',this.userId)
    axios.get(`${baseUrl}?userId=${this.userId}`)
      .then(res => {
        // console.log('getUserInfo:',res)
        if(res.status === 200 && res.data ){
          this.setState({
            loginUser: res.data[0],
            payImgUrl: res.data[0].avator
          })
          console.log('用户信息查询成功',res.data[0])
        } else {
          console.log('查询失败！')
        }
      })
  }

  getLibs() {
    let userId = this.userId;
    let libs = [];
    axios.get('http://localhost:9000/library/queryALl')
     .then(
       (res) => {
        res.data.map( item => {
          if( item.ownerId === parseInt(userId)) {
            libs.push(item);
          }
        })
       
        this.setState({
          libs: libs,
          selectedLib: libs[0]  // 初始化选择默认值
        })

        if(libs.length !== 0){
          this.setState({
            noLibHint: false
          })
        }
    })
  }
  // 图书集菜单触发

  onSelect(index,indexPath) {
    console.log(index,indexPath)
    if (index === '4') {
      this.showUserInfo();
    }else if (index === '2-2'){
      this.showAddLibrary();
    } else if(index === '3') {
      console.log('onselect',this.state.noLibHint)
      this.addBook();
    } else if (index === '2-1') {
      console.log('onselect',this.state.noLibHint)
      this.showBook();
    } else if (index === '5') {
      this.jumpToLibData();
    } else if (index === '6') {
      this.showExcept();
    }
  }

  logOut = () => {
    this.setState({
      visible: false,
    });
    let history = this.props.history;
    history.replace('/');
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  showUserInfo() {  //  头像设置
    this.setState({
      showUserInfo: true
    })
  }

  onFinish = values => {
    console.log('Received values of form: ', values);
    let history = this.props.history;
    this.addLibrary(values);
    
    // history.push('/homepage');
  }

  addLibrary = values => {
    console.log('图书集：', values)
    var library = Object.assign({},values)
    // var libName = library.libName;
    // var libClass = library.libClass;
    // var location = library.location;
    var baseUrl = 'http://localhost:9000/library/add';
    axios.get(`${baseUrl}?libName=${library.libName}&libClass=${library.libClass}&libLocation=${library.location}&ownerId=${this.userId}`)
      .then(res => {
        if(res.status === 200 && res.data === 'success'){
          message.success('添加成功！');
        } else {
          message.error('添加失败！')
        }
      })
  }

  showAddLibrary = values => {
    this.setState({
      addLibraryOn: true,
      addBookOn: false,
      showBookOn: false,
      showUserInfo: false,
      libDataShow: false,
      excerptShow: false
    })
    // console.log('...' + this.state.noLibHint)
  } 

  addBook() {
    this.setState({
      addLibraryOn: false,
      addBookOn: true,
      showBookOn: false,
      showUserInfo: false,
      libDataShow: false,
      excerptShow: false
    })
  }

  showBook() {
    !this.state.noLibHint &&
    this.setState({
      noLibHint:false,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: true,
      showUserInfo: false,
      libDataShow: false,
      excerptShow: false
    })
  }

  showExcept() {
    this.setState({
      noLibHint:false,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: false,
      showUserInfo: false,
      libDataShow: false,
      excerptShow: true
    })
  }
  
  handleReset() {  
    this.formRef.current.resetFields();
  }
  
  onChange(key, value) {
    // console.log('cahnge:',value)
    // this.setState({
    //   form: Object.assign({}, this.state.form, { [key]: value })
    // });
  }
  modalOk = e => {
    console.log(e);
    this.setState({
      showUserInfo: false,
    });
  };
  
  modalCancel = e => {
    console.log(e);
    this.setState({
      showUserInfo: false,
    });
  };

  confirm = () => {

  }
  cancel = () => {

  }

  jumpToLibData() {
    this.setState({
      noLibHint:false,
      addLibraryOn: false,
      addBookOn: false,
      showBookOn: false,
      showUserInfo: false,
      libDataShow: true
    })
  }

  render() {
    // console.log('this.state.noLibHint',this.state.noLibHint,'libs',this.state.libs,'selecelib',this.state.selectedLib)

    return (
      <div className="homepage-main">
        <div className="nav">
          {/* <Layout.Col span={6}> */}
          <Menu defaultActive="2" onSelect={this.onSelect.bind(this)} className="el-menu-vertical-demo" /* onOpen={this.onOpen.bind(this)} onClose={this.onClose.bind(this)} */>
            <Menu.ItemGroup title="私人藏书管理系统" className="mainTitle">
              
              <Menu.Item index="0" className="userInfo">
                <Popover
                  style={{width:'150px'}}
                  placement="rightTop"
                  content={ <a onClick={this.logOut.bind(this)}> &emsp;&emsp;用户登出&emsp;&emsp;</a> }
                  visible={this.state.visible}
                  onVisibleChange={this.handleVisibleChange.bind(this)}
                >
                  <div className="avatar">
                    <img src={ this.state.payImgUrl ? this.state.payImgUrl : defaultAvatar}/>
                  </div>
                  {this.state.loginUser.userName}
               </Popover>

              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.SubMenu index="2" title={<span><ReadOutlined className="menu-style"/>图书集</span>} >
              <Menu.ItemGroup title="">
                <Menu.Item index="2-1">我的图书集</Menu.Item>
              </Menu.ItemGroup>
              <div className="line"></div>
              <Menu.ItemGroup>
                <Menu.Item index="2-2">添加 / 删除图书集</Menu.Item>
              </Menu.ItemGroup>
              
            </Menu.SubMenu>
            <Menu.Item index="3"><FileAddOutlined className="menu-style"/>添加图书</Menu.Item>
            <Menu.Item index="4"><SettingOutlined className="menu-style"/>设置</Menu.Item>
            <Menu.Item index="5"><BarChartOutlined className="menu-style"/>我的图书数据</Menu.Item>
            <Menu.Item index="6"><FormOutlined className="menu-style"/>我的摘录</Menu.Item>
          </Menu>
          {/* </Layout.Col> */}
        </div>
        <div className="main-content">
          <UserInfo payImgUrl={this.state.payImgUrl} userInfo={this.state.loginUser} visible={this.state.showUserInfo} 
            modalOk={this.modalOk} modalCancel={this.modalCancel} userInfoChanged={this.getUserInfo.bind(this)}/>
        {
          this.state.libDataShow ?             
            <div>
              <LibData userInfo={this.state.loginUser}/> 
            </div>
          : ''
        }
        {
          this.state.addLibraryOn ? (
            <AddLib userId={this.userId}/>
          ) : ''
        }
        {
          this.state.addBookOn && !this.state.noLibHint ? (
            <div className="content-style addBook">
               <h1>添加图书</h1>
              <AddBookItem noLibHint={this.state.noLibHint} userId={this.userId}/>
            </div>
          ) : ''
        }

        {
          this.state.excerptShow ? 
          (<Excerpt userId={this.userId}/>) : ''
        }

        {
          this.state.noLibHint ?
          <div className="content-style no-content-hint">
            <img src={noContentImg} />
            <span>您还没有创建图书集哦!</span><br />
            <span>快去建立属于您的图书集吧!</span>
        </div>
          : ''
        }
        {
          this.state.showBookOn && !this.state.noLibHint? 
          ( <Bookshow userId={this.userId} selectLibId={this.state.selectedLib.libId}/> ) : 
            ''
        }
        
        </div>
      </div>
    )
  }
}

export default Homepage