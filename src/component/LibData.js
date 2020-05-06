import ReactEcharts from 'echarts-for-react';
import React from 'react'
import axios from 'axios'
import { Form, Input, Button, message } from 'antd';
import './LibData.scss'

class LibData extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      booksTotalCnt: 0,
      libTotalCount: 0,
      booksFromLib: [],
      bookType: [],
      librarys: [],
      progress: [],
    }
  }

  getBookCount() {
    axios.get('http://localhost:9000/statistics/getBookCount')
    .then(
      res => {
        console.log('getBookCount',res)
        let booksTotalCnt = res.data[0].count;
        let libTotalCount = res.data[1].count;
        let booksfromLib = res.data.slice(2);
        let booksFromLib = [];
        for( let item of booksfromLib) {
          booksFromLib.push(item.count);
        }
        console.log('booksTotalCnt:',booksTotalCnt,' libTotalCount:',libTotalCount,' booksFromLib:',booksFromLib)
        this.setState({
          booksTotalCnt: booksTotalCnt,
          libTotalCount: libTotalCount,
          booksFromLib: booksFromLib
        })
      }
    )
  }

  getBookType() {
    let baseUrl = 'http://localhost:9000/statistics/getBookType'
    axios.get(`${baseUrl}`)
    .then(
      res => {
        console.log('getBookType:',res)
        this.setState({
          bookType: res.data
        })
      }
    )
  }

  getLibs() {
    let userId = this.props.userId;
    // console.log('userId',this.props)
    let libs = [];
    axios.get('http://localhost:9000/library/queryAll')
     .then(
       (res) => {
        console.log('getLibs:',res);
        res.data.map( item => {
          // if( item.ownerId === parseInt(userId)) {
            libs.push(item);
          // }
        })
        this.setState({
          librarys: Object.assign( [], this.state.librarys, libs),
        })
    })
  }

  getProgress() {
    axios.get('http://localhost:9000/statistics/getBookProgress')
    .then(
      (res) => {
       console.log('getBookProgress:',res);
        this.setState({
         progress: res.data
       })
   })
  }

  async componentDidMount() {
    await Promise.all([ this.getBookCount() ]);
    this.getLibs();
    // this.getBookType();
    this.getProgress();
    
  }

  getProgressOption() {
    let progress = this.state.progress;
    let one,two,three,four,five;
    if(progress[0] !== undefined)
      one = progress[0].count;
    if(progress[1] !== undefined)
      two = progress[1].count;
    if(progress[2] !== undefined)
      three = progress[2].count;
    if(progress[3] !== undefined)
      four = progress[3].count;
    if(progress[4] !== undefined)
      five = progress[4].count;

    console.log('getProgressOption->',progress,'one','two',two,'three',three,'four',four,'five',five);

    const option = {
      // backgroundColor: '#2c343c',

    title: {
        text: '阅读情况',
        left: '40%',
        top: 20,
        textStyle: {
          color: 'black'
        }
    },

    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },

    visualMap: {
        show: false,
        min: 0,
        max: 100,
        inRange: {
          colorLightness: [0, 0.9]
        },
    },
    series: [
      {
        width: 'auto',
        height: 'auto',
        name: '阅读进度',
        type: 'pie',
        radius: '58%',
        data: [
          {value: one, name: '还未开始阅读'},
          {value: two, name: '阅读进度为0～30%'},
          {value: three, name: '阅读进度为30%～60%'},
          {value: four, name: '阅读进度为60%～99%'},
          {value: five, name: '阅读完成'},
        ].sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          color: 'rgb(1, 64, 80)',
          fonSize: '14px',
          width:'100%',
        },
        labelLine: {
            lineStyle: {
              color: 'rgba(131, 14, 0, 0.5)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: 'rgb(170,18,73)',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
      }
    ]
    };
    return option;
  }

  getBookTypeOption() {
    let bookType = this.state.bookType;
    console.log('getBookTypeOption-> bookType',this.state.bookType)
    let xiaoshuo = 0 , shige = 0, sanwen = 0, zheli = 0, lishi, other ;
    if(bookType[0] !== undefined)
      xiaoshuo = bookType[0].count;
    if(bookType[1] !== undefined)
      shige = bookType[1].count;
    if(bookType[2] !== undefined)
      sanwen = bookType[2].count;
    if(bookType[3] !== undefined)
      zheli = bookType[3].count;
    if(bookType[4] !== undefined)
      lishi = bookType[4].count;
    if(bookType[5] !== undefined)
      other = bookType[5].count;    

    const option = {
      // backgroundColor: '#2c343c',

    title: {
        text: '图书类型',
        left: '40%',
        top: 20,
        textStyle: {
            color: 'black'
        }
    },

    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
    },

    visualMap: {
        show: true,
        min: 0,
        max: 100,
        inRange: {
          colorLightness: [0, 0.9]
        },
    },
    series: [
      {
        width: 'auto',
        height: 'auto',
        name: '图书类型',
        type: 'pie',
        radius: '55%',
        data: [
          {value: xiaoshuo, name: '小说'},
          {value: shige, name: '诗歌'},
          {value: sanwen, name: '散文'},
          {value: zheli, name: '哲理'},
          {value: lishi, name: '历史'},
          {value: other, name: '其他'}
        ].sort(function (a, b) { return a.value - b.value; }),
        roseType: 'radius',
        label: {
          color: 'rgba(250, 59, 50, 0.3)'
        },
        labelLine: {
            lineStyle: {
              color: 'rgba(255, 100, 255, 0.5)'
            },
            smooth: 0.2,
            length: 10,
            length2: 20
          },
          itemStyle: {
            color: '#c11231',
            shadowBlur: 200,
            shadowColor: 'rgba(0, 0, 0, 0.2)'
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
      }
    ]
    };
    return option;
}

getLibOption() {
  // this.getLibs();
  console.log('getLibOption-> librarys',this.state.librarys)
  let libName = [];
  for( let item of this.state.librarys) {
    libName.push(item.libName);
  }
  console.log('libName',libName)
  const option = {
    title: {
      text: '图书集收录情况',
      left: '35%',
      // top: 10,
      textStyle: {
        color: 'rgb(121, 20, 20)',
        textShadow: '2px 3px rgb(170,18,73)'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {            // 坐标轴指示器，坐标轴触发有效
        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis: {
      type: 'category',
      data: libName
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      width: '400px',
      height: 'auto',
      name: '访问来源',
      // center: ['200px', '50%'],
      data: this.state.booksFromLib,
      type: 'bar',
      showBackground: true,
      backgroundStyle: {
        color: 'rgba(220, 220, 220, 0.8)'
      }
    }]
  };

  return option;
}

getTimeOption() {
  const option = {
    legend: {},
    tooltip: {},
    dataset: {
        source: [
            ['product', '2015', '2016', '2017'],
            ['Matcha Latte', 43.3, 85.8, 93.7],
            ['Milk Tea', 83.1, 73.4, 55.1],
            ['Cheese Cocoa', 86.4, 65.2, 82.5],
            ['Walnut Brownie', 72.4, 53.9, 39.1]
        ]
    },
    xAxis: {type: 'category'},
    yAxis: {},
    // Declare several bar series, each will be mapped
    // to a column of dataset.source by default.
    series: [
        {type: 'bar'},
        {type: 'bar'},
        {type: 'bar'}
    ]
  };

  return option;
}

  render() {
    return (
      <div className="content-style libData">
        <div className="bookCnt">
          <p className="totalText">
            您过去一共收集了<span className="mainData">「{this.state.booksTotalCnt}」</span>本书。
            <br/>
            一共创建了<span className="mainData">「{this.state.librarys.length}」</span>个图书集。
          </p>
          <ReactEcharts
            className="libCharts"
            option={this.getLibOption()}
            style={{height: '350px', width: '380px'}}
            />
        </div>
        <div className="bookType">
          <ReactEcharts
            className="typeCharts"
            option={this.getBookTypeOption()}
            style={{height: '400px', width: '400px',marginRight:'150px'}}
            />
          <p className="totalText">您过去在收集的图书类别主要集中在<span className="mainData">「小说」</span></p>
        </div>
        <div className="progress">
          <ReactEcharts
            className="progressCharts"
            option={this.getProgressOption()}
            style={{height: '400px', width: '500px',marginRight:'150px'}}
            />
          {/* <p className="totalText">您过去在收集的图书类别主要集中在<span className="mainData">「小说」</span></p> */}
        </div>
        
        {/* <ReactEcharts
          option={this.getTimeOption()}
          style={{height: '400px', width: '400px'}}
          /> */}
      </div>
      
    );
  }
}

export default LibData