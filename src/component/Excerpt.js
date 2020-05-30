import ReactEcharts from 'echarts-for-react';
import React from 'react'
import axios from 'axios'
import { Form, Input, Button, message, Divider } from 'antd';
import './Excerpt.scss'
import noContentImg from '../img/no-content.jpg'


class Excerpt extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }

  getExcerpt() {
    var baseUrl = 'http://localhost:9000/books/queryExcerpt';
    console.log('userId',this.props.userId)
    axios.get(`${baseUrl}?ownerId_b=${this.props.userId}`)
      .then(res => {
        console.log('getExcerpt:',res)
        if(res.status === 200 && res.data ){
          this.setState({
            books: res.data,
          })
        }
      })
  }

  componentDidMount() {
    this.getExcerpt();
  }

  render() {
    return (
      <div className="content-style Excerpt">
        {
          this.state.books.length !==0 ?
          this.state.books.map( item => {
            return (
              <div className = 'single_excerpt'>
                {item.excerpt}
                <p className='bookName'> ---《{item.bookName}》</p>
              </div>
            );
          })
          : 
          <div className="no-content-hint">
            <img src={noContentImg} />
            <span>您还没有添加任何摘录哦!</span><br />
            <span>赶快去记录您的灵感吧!</span>
        </div>
        }
         
      </div>
    );
  }
}

export default Excerpt