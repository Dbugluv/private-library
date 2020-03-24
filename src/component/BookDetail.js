import React from 'react';
// import { Icon } from 'element-react';
import { Divider, Tabs, Select } from 'antd';
import { AppstoreOutlined, MenuOutlined } from '@ant-design/icons';
import book2 from '../img/book1.jpg'
import book3 from '../img/book3.jpeg'
import book4 from '../img/book4.jpg'
import './BookDetail.scss'

class BookDetail extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    
    return (
      <div className="single-book-detail">
        <div className="imagecover">
          <img src={book2} />
        </div>
        <div className="single-book-info">
        <span className="bookName">「{this.props.bookName}」</span><br/>
          <span className="author">author：{this.props.author}</span><br/>
          <span className="buyTime">购入时间：{this.props.buyTime}</span>
          <Divider />
          <p className="brief">{this.props.brief}</p>
        </div>
      </div>
    );
  }
}

export default BookDetail