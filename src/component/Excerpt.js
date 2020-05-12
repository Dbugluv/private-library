import ReactEcharts from 'echarts-for-react';
import React from 'react'
import axios from 'axios'
import { Form, Input, Button, message, Divider } from 'antd';
import './Excerpt.scss'


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
          this.state.books.map( item => {
            return (
              <div className = 'single_excerpt'>
                {item.excerpt}
                <p className='bookName'> ---《{item.bookName}》</p>
              </div>
            );
          })
        }
         
      </div>
    );
  }
}

export default Excerpt