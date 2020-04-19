import React from 'react';
import axios from 'axios'
import { Input, Tabs, Select, message, Pagination } from 'antd';
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
      showPageBookItems: []
    }
  }
  book = [];

  selectChange(libName,libId) {
    this.setState({
      selectedLib: Object.assign({},libName,libId)
    })
    /* console.log('selectChange:',this.state.selectedLib);
    let defaultSelectId = this.state.selectedLib.libId || parseInt(this.state.selectedLib.key)    // 拷贝过去的id变成string类型

    this.state.bookLists.map((item, index) => {
      if(item.ownedLibId === defaultSelectId){
        this.setState({
          selectedBookList: Object.assign({},item)
        })(console.log('selectBooklist:',this.state.selectedBookList))
      }
    }) */
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
    axios.get('http://localhost:3000/api/librarys')
     .then(
       (res) => {
        this.setState((state) => {
          return {
            librarys: Object.assign( [],state,res.data),
            selectedLib: res.data[0]  // 初始化选择默认值
          }
        })
    })
  }

  getBookDetail() {
    axios.get(`http://localhost:9000/books/queryALl`)
    // axios.get(`http://localhost:3000/api/books`)
    .then((res)=>{
      this.setState({
        bookLists: res.data,
        showPageBookItems: res.data.slice(0,10)
      })
    })
  }

  componentDidMount() {
    console.log('bookshow!!!')
    this.getBookDetail();
    this.getLibs();
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

  findBook(value) {
    console.log('findinfo',value,typeof(value))
    var baseUrl = 'http://localhost:9000/books/getByName'
    axios.get(`${baseUrl}?bookName=${value}`)
    .then((res) => {
      console.log('findbookapi',res);
    })
  }

  render() {
    const { TabPane } = Tabs;
    const { Option } = Select;
    let defaultSelectValue = this.state.selectedLib.libName || this.state.selectedLib.value
    let defaultSelectId = this.state.selectedLib.libId || parseInt(this.state.selectedLib.key)    // 拷贝过去的id变成string类型
    const bookCount = this.state.bookLists.length;
    console.log('legnth',bookCount)
    console.log('showpagenumaud:- ',this.state.showPageBookItems)

    return (
      <div className="content-style showBook">
        <Select
          showSearch
          value={defaultSelectValue}
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
        placeholder="输入您想要查找对书籍"
        onSearch={this.findBook.bind(this)}
        className="bookSearch"
      />
        <Tabs className="tab" defaultActiveKey="1">
          <TabPane
            tab={<span><AppstoreOutlined />缩略图表</span>}
            key="1"
          >
            <div className = "book-content">
              {
                this.state.showPageBookItems.map((item, index) => {
                  if(item.ownedLibId === defaultSelectId){
                    return (
                      this.state.detailOn[item.bookId] ? 
                        <BookDetail bookName={item.bookName} author={item.author} bookCover ={item.bookCover}
                          buyTime={item.buyTime} brief={item.brief}/> : 
                      <div key={item.bookId} className="single-book" onClick={this.showDetail.bind(this,item.bookId)}>
                        <img src={item.bookCover} />
                        <span>{item.bookName}</span>
                      </div>)
                  }
                })
              }
            </div>
            <Pagination simple defaultCurrent={1} current={this.state.currentPage} total={bookCount} pageSize={10}
              onChange={this.pageNumberOnChange.bind(this)} showTotal={total => `一共有 ${bookCount} 本书`} />
          </TabPane>
          <TabPane
            tab={<span> <MenuOutlined />详细列表</span>}
            key="2"
          >
            <div className = "book-content">
              { 
                this.state.bookLists.map((item, index) => {
                  if(item.ownedLibId === defaultSelectId){
                    return (
                      <BookDetail bookName={item.bookName} author={item.author} bookCover={item.bookCover}
                        buyTime={item.buyTime} brief={item.brief}
                        />
                    );
                  }
                })
              }
            </div>
            <Pagination simple defaultCurrent={1} total={bookCount} pageSize={5}
              onChange={this.pageNumberOnChange.bind(this)} showTotal={total => `一共有 ${bookCount} 本书`} />
          </TabPane>
        </Tabs>
 
      </div>
    );
  }
}

export default Bookshow;


