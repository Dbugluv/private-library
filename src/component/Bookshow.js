import React from 'react';
import axios from 'axios'
import { Upload, Tabs, Select,message } from 'antd';
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

class Bookshow extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      opt: [],
      detailOn: false,
      bookLists: [],
      librarys: [],
      selectedLib: '',
      error: null
    }
    const defaultSelectValue = ''
  }

  onChange(value) {

    console.log(`selected ${value}`);
  }
  
  onBlur() {
    console.log('blur');
  }
  
  onFocus() {
    console.log('focus');
  }
  
  onSearch(val) {
    console.log('search:', val);
  }
  showDetail() {
    this.setState({
      detailOn: !this.state.detailOn
    })
  }
  
  getLibs() {
    axios.get('http://localhost:3000/api/librarys')
     .then(
       (res) => {
        this.setState((state) => {
          console.log('ssss',state)
          return {
            librarys: Object.assign( [],state,res.data),
            selectedLib: res.data[0].libName
          }
        })
      // this.defaultSelectValue = res.data[0].libName
    })
  }
   componentDidMount() {
    this.getBookDetail();
    this.getLibs();
  }

  // componentDidUpdate() {
  //   console.log('booklist: ',this.state.bookLists)
  //   console.log('策四啊: ',this.state.librarys[0])
  // }
  
  async getBookDetail() {
    axios.get(`http://localhost:3000/api/books`)
    .then((res)=>{
      // console.log('res: ',res)
      this.setState({
        bookLists: res.data
        })
    })
  }
  render() {
    const { TabPane } = Tabs;
    const { Option } = Select;
    let defaultSelectValue = this.state.selectedLib
    console.log('selel :', defaultSelectValue)
    return (
      <div className="content-style showBook">
         <select
          style={{ width: 600 }}
         >
          {
            this.state.librarys.map((item,index) => {
              return (
                <option value={item.libName}>{item.libName}</option>
              )
            })
          }
        </select> 
        <Select
          showSearch
          style={{ width: 600 }}
          placeholder="选择你的图书集"
          optionFilterProp="children"
          onChange={this.onChange.bind(this)}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onSearch={this.onSearch.bind(this)}
        >        
        {
           this.state.librarys.map((item,index) => {
            return (
              <Option value={item.libName}>{item.libName}</Option>
            )
          })
         }
      </Select>

        <Tabs className="tab" defaultActiveKey="2">
          <TabPane
            tab={<span>
                  <AppstoreOutlined />缩略图表
                </span>}
            key="1"
          >
            <div className = "book-content">
              { 
                // this.state.detailOn ? <BookDetail />
                // : (<div className="single-book" onClick={this.showDetail.bind(this)}>
                //   <div><img src={book2} /></div>
                //   <span>我的孤独是一座花园</span>
                // </div>) 
              }
              {
                this.state.bookLists.map((item, index) => {
                  // console.log('item! ',item)
                  return (
                    this.state.detailOn ? 
                      <BookDetail bookName={item.bookName} author={item.author}
                        /> : 
                    <div className="single-book">
                      <img src="item.bookCover" />
                      <span>{item.bookName}</span>
                    </div>)
                })
              }
              
              {/* <div className="single-book">
                <div><img src={book2} /></div>
                <span>我的孤独是一座花园</span>
              </div>  */}
            </div>
            
          </TabPane>
          <TabPane
            tab={<span>
                  <MenuOutlined />详细列表
              </span>
            }
            key="2"
          >
            <div className = "book-content">
              {/* <BookDetail /> */}
              { 
                this.state.bookLists.map((item, index) => {
                  return (
                    <BookDetail bookName={item.bookName} author={item.author}
                      buyTime={item.buyTime} brief={item.brief}
                      />
                  );
                })
              }
            </div>
          </TabPane>
        </Tabs>
 
      </div>
    );
  }
}

export default Bookshow;


