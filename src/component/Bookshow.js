import React from 'react';
import axios from 'axios'
import { Input, Tabs, Select, message, Pagination, Radio } from 'antd';
import { deepClone } from '../modules'
import { AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import BookDetail from './BookDetail'
import 'antd/dist/antd.css';
import './Bookshow.scss'
import bookImg from '../img/book.jpg'
import book2 from '../img/book1.jpg'
import book3 from '../img/book3.jpeg'
import book4 from '../img/book4.jpg'
import { format } from 'mysql';
const { Search } = Input;

class Bookshow extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      opt: [],
      detailOn: [],
      bookLists: [],
      selectedBookList: [],
      librarys: [],
      selectedLib: '',
      error: null,
      currentPage: 1,
      showPageBookItems: [],
      activeKey: 1, // tab 默认标签页
      bookTypeOptions:['小说', '诗歌', '散文', '哲理', '历史', '其他','所有'],
      checkedBookTypeList: '',
    }
  }
  book = [];

  selectChange(libName,value) {
    let selectedLib = {
      libName: libName,
      libId: value.key
    }
    this.setState({
      selectedLib: Object.assign({},selectedLib)
    })
    console.log('selectChange',this.state.checkedBookTypeList,value.key)
    this.getBookByCategory(this.state.checkedBookTypeList, value.key );
  }
  
  onBlur() {
    // console.log('blur');
  }
  
  onFocus() {
    // console.log('focus');
  }
  
  onSearch(val) {
    // console.log('search:', val);
  }
  showDetail(key) {
    this.book[key] = true
    this.setState({
      detailOn: Object.assign([], ...this.state.detailOn, this.book)
    })
  }
  
  getLibs() {
    let userId = this.props.userId;
    let libs = [];
    axios.get('http://localhost:3000/api/librarys')
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

  getBookDetail() {
    axios.get(`http://localhost:9000/books/queryALl`)
    // axios.get(`http://localhost:3000/api/books`)
    .then((res)=>{
      console.log('bookshow:res',res)
      this.setState({
        bookLists: res.data,
        showPageBookItems: res.data.slice(0,10)
      })
    })
  }


  componentDidMount() {
    this.getBookDetail();
    this.getLibs();
  }

  componentWillReceiveProps(props) {
    let ownedLibId = this.state.selectedLib.libId
    console.log('ownedLibId',ownedLibId)
    ownedLibId && this.getBookByCategory('所有',ownedLibId);
  }

  pageNumberOnChange = (page,pageSize) => { 
    console.log(page,pageSize)       
    let startNum = page > 0 ? (page - 1) * pageSize : 0;
    let tempDisplayAudits = this.state.bookLists.slice(startNum, startNum + pageSize);
    this.setState(
        {                
          showPageBookItems: tempDisplayAudits,
          currentPage:page
        }
    );        
  }

  getBookByCategory(booktype, ownedLibId) {
    console.log('getbookvatrgoru:',booktype,ownedLibId)
    if( booktype === '所有' || booktype === '') {
      var baseUrl = 'http://localhost:9000/books/selectByLibs'
      axios.get(`${baseUrl}?ownedLibId=${ownedLibId}`)
      .then(
        res => {
          console.log('getBookBylibs-res:', res)
          this.setState({
            bookLists: res.data,
            showPageBookItems: res.data.slice(0,10)
          })
        }
      )
      .then(
        console.log('showPageBookItems',this.state.showPageBookItems)
      )
    } else {
      var baseUrl = 'http://localhost:9000/books/selectByCategory'
      axios.get(`${baseUrl}?bookType=${booktype}&ownedLibId=${ownedLibId}`)
      .then(
        res => {
          console.log('getBookByCategory-res:', res)
          this.setState({
            bookLists: res.data,
            showPageBookItems: res.data.slice(0,10)
          })
        }
      )
      .then(
        console.log('showPageBookItems',this.state.showPageBookItems)
      )
    }
    
  }

  handlebookTypeChange(e) {
    this.setState({
      checkedBookTypeList: e.target.value
    })
    // console.log('booktype:',e.target.value)
    let ownedLibId = this.state.selectedLib.libId
    this.getBookByCategory(e.target.value, ownedLibId );
  }

  findBook(value) {
    if(!value) {
      this.getBookDetail()
    } else {
      var baseUrl = 'http://localhost:9000/books/getByName'
      axios.get(`${baseUrl}?bookName=${value}`)
      .then((res) => {
        if(res && res.data){
          this.setState({
            showPageBookItems: res.data,
            activeKey : 2
          })
        }
      })
    }
  }

  render() {
    const { TabPane } = Tabs;
    const { Option } = Select;
    // console.log('this.state.selectedLib',this.state.selectedLib,'checkedBookTypeList',this.state.checkedBookTypeList)
    let selectedLib = this.state.selectedLib;
    let defaultSelectValue = this.state.selectedLib.libName;
    const bookCount = this.state.bookLists.length;
    // console.log('bookCnt',bookCount)

    return (
      <div className="content-style showBook">
        <Select
          showSearch
          value={this.state.selectedLib.value || defaultSelectValue}
          className="select"
          placeholder="选择你的图书集"
          optionFilterProp="children"
          onChange={this.selectChange.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onSearch={this.onSearch.bind(this)}
        >
        {
           this.state.librarys.map((item,index) => {
            return (
              <Option key={item.libId} value={item.libName}>{item.libName}</Option>
            )
          })
         }
      </Select>
      <Search
        placeholder="输入您想要查找的书籍名称"
        onSearch={this.findBook.bind(this)}
        className="bookSearch"
        allowClear
      /><br/>
      <span style={{fontSize:'12px',color:'rgb(52, 100, 98)'}}>仅查看相关类别图书：</span>
      <Radio.Group
        options={this.state.bookTypeOptions}
        value={this.state.checkedBookTypeList}
        onChange={this.handlebookTypeChange.bind(this)}
      /> 
        <Tabs className="tab" defaultActiveKey="2">
          <TabPane
            tab={<span><AppstoreOutlined />缩略图表</span>}
            key="1"
          >
            <div className = "book-content">
              {
                this.state.showPageBookItems.map((item, index) => {
                  if(item.ownedLibId == selectedLib.libId){
                    return (
                      this.state.detailOn[item.bookId] ? 
                        <BookDetail bookInfo={item} bookChanged={this.getBookDetail.bind(this)} /> : 
                        <div key={item.bookId} className="single-book" onClick={this.showDetail.bind(this,item.bookId)}>
                          <img src={item.bookCover} />
                          <span>{item.bookName}</span>
                        </div>)
                  }
                })
              }
            </div>
            <Pagination simple current={this.state.currentPage} total={bookCount} pageSize={10}
              onChange={this.pageNumberOnChange.bind(this)} showTotal={ bookCount => `一共有 ${bookCount} 本书`} />
          </TabPane>
          <TabPane
            tab={<span> <MenuOutlined />详细列表</span>}
            key="2"
          >
            <div className = "book-content">
              { 
                this.state.showPageBookItems.map((item, index) => {
                  if(item.ownedLibId == selectedLib.libId){
                    return (
                      <BookDetail bookInfo={item} bookChanged={this.getBookDetail.bind(this)}/>
                    );
                  }
                })
              }
            </div>
            <Pagination simple current={this.state.currentPage} pageSize={10} total={bookCount} showTotal={ bookCount => `一共有 ${bookCount} 本书`}
              onChange={this.pageNumberOnChange.bind(this)}  />
          </TabPane>
        </Tabs>
 
      </div>
    );
  }
}

export default Bookshow;


