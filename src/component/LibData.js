import ReactEcharts from 'echarts-for-react';
import React from 'react'
import axios from 'axios'
import { Form, Input, Button, message, Divider } from 'antd';
import './LibData.scss'
import { resolveOnChange } from 'antd/lib/input/Input';
import { max } from 'moment';

let maxBooktype = '';
let maxType = 0;
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
      books:[],
      bookType: [],
      buyTime: [],
      readProgress: [],
      userInfo: {}
    }
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.userInfo !== nextProps.userInfo){
      // console.log('nextprops',nextProps.userInfo)
      this.setState({
        userInfo: Object.assign( {}, this.state.userInfo, nextProps.userInfo)
      })
      this.getBook();
    }
  }

  getBook() {
    // console.log('getBookuserID',this.state.userInfo)
    let baseUrl = 'http://localhost:9000/books/queryByUserId'
    axios.get(`${baseUrl}?ownerId_b=${this.state.userInfo.userId}`)
    .then(
      res => {
        console.log('getBook',res)
        this.setState({
          books: res.data,
        })
      }
    )
  }

  getBookCount() {
    axios.get('http://localhost:9000/statistics/getBookCount')
    .then(
      res => {
        console.log('getBookCount',res)
        let booksTotalCnt = res.data[0].count;
        let booksfromLib = res.data.slice(1);
        let booksFromLib = [];
        for( let item of booksfromLib) {
          booksFromLib.push(item.count);
        }
        booksFromLib = booksFromLib.reverse()
        console.log('booksTotalCnt:',booksTotalCnt,' booksFromLib:',booksFromLib)
        this.setState({
          booksTotalCnt: booksTotalCnt,
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
    var baseUrl = 'http://localhost:9000/library/ownerLib'
    let libs = [];
    axios.get(`${baseUrl}?ownerId=${this.state.userInfo.userId}`)
     .then(
       (res) => {
        // console.log('getLibs:',res);
        res.data.map( item => {
            libs.push(item);
        })
        this.setState({
          librarys: Object.assign( [], this.state.librarys, libs),
        })
    })
  }

  getProgress() {
    var baseUrl = 'http://localhost:9000/statistics/getBookProgress';
    let userId = this.state.userInfo.userId;
    console.log('getProgress,userId: ',userId)
    axios.get(`${baseUrl}?userId=${userId}`)
    .then(
      (res) => {
       console.log('getReadProgress:',res);
        this.setState({
         progress: res.data
       })
   })
  }

  componentDidMount() {
    setTimeout(() => {
      this.getBookCount();
    }, 200);

    setTimeout(() => {
      this.AnalysisBookData()
    }, 500);

    setTimeout(() => {
      this.getLibs();
    }, 300);
    setTimeout(() => {
      this.getProgress();
    }, 400);
  
  }

  AnalysisBookData() {
    let books = this.state.books;
    let bookType = [];
    let buyTime = [];
    books.map( (item, index) => {
      bookType.push(item.bookType);
      buyTime.push(item.buyTime);
    })
    this.setState({
      bookType: Object.assign([], this.state.bookType, bookType),
      buyTime: Object.assign([], this.state.buyTime, buyTime),
    })
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

    // console.log('getProgressOption->',progress,'one',one,'two',two,'three',three,'four',four,'five',five);

    const option = {
    title: {
        text: '阅读情况',
        left: '40%',
        top: 20,
        textStyle: {
          color: 'rgb(121, 20, 20)',
          textShadow: '2px 3px rgb(170,18,73)'
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
          colorLightness: [0.3, 1]
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
    // let bookType = this.state.bookType;
    let xiaoshuo = 0 , shige = 0, sanwen = 0, zheli = 0, lishi = 0, other = 0 ;
    let bookTypeObject = [];
    this.state.bookType.map( item => {
      switch(item) {
        case '小说':
          xiaoshuo++;
          break;
        case '诗歌':
          shige++;
          break;
        case '散文':
          sanwen++;
          break;
        case '哲理':
          zheli++;
          break;
        case '历史':
          lishi++;
          break;
        case '其他':
          other++;
          break;
        default:
          break;
      }
    })
    
    bookTypeObject.push(xiaoshuo,shige,sanwen,zheli,lishi,other)
    maxType = Math.max(xiaoshuo,shige,sanwen,zheli,lishi,other);
    if(maxType === 0) maxBooktype = '小说'
      else if (maxType === 1) maxBooktype = '诗歌'
      else if (maxType === 2) maxBooktype = '散文'
      else if (maxType === 3) maxBooktype = '哲理'
      else if (maxType === 4) maxBooktype = '历史'
      else if (maxType === 5) maxBooktype = '其他'

    const option = {
      // backgroundColor: '#2c343c',

    title: {
        text: '图书类型分布',
        left: '40%',
        top: 20,
        textStyle: {
          color: 'rgb(121, 20, 20)',
          textShadow: '2px 3px rgb(170,18,73)'
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
          colorLightness: [0.3, 1]
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
          color: 'rgb(1, 64, 80)',
          fonSize: '14px',
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

getLibOption() {
  // this.getLibs();
  console.log('getLibOption-> librarys',this.state.librarys)
  let libName = [];
  for( let item of this.state.librarys) {
    libName.push(item.libName);
  }
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
      name: '藏书总数',
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
  let buyTime = this.state.buyTime;
  let buyYear = [];
  
  buyTime.map( item => {
    buyYear.push(item.substring(0,4))
  })
  let buyYearSet = Array.from(new Set(buyYear));
  let yearCnt = new Array(buyYearSet.length);
  for(var t = 0; t < yearCnt.length; t++) {
    yearCnt[t] = 0;
  }
  for(var p = 0; p < buyYearSet.length; p++) {
      for(var j = 0; j < buyTime.length; j++) {
          if(buyYearSet[p] === buyTime[j].substring(0,4)) {
            yearCnt[p]++;
          }
      }
  }
  console.log('buyYear',buyYearSet,'yearCnt',yearCnt);

  const option = {
    title: {
      text: '图书购买时间分布',
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
    xAxis: {
        type: 'category',
        data: buyYearSet
    },
    yAxis: {
        type: 'value'
    },
    series: [{
        data: yearCnt,
        type: 'bar',
        name: '购入藏书总数',
        showBackground: true,
        backgroundStyle: {
            color: 'rgba(220, 220, 220, 0.8)'
        }
    }]
  };

  return option;
}

  render() {
    let user = this.props.userInfo
    return (
      <div className="content-style libData">
        <div className="userWelcom">
          <p className="saying">书卷多情似故人，晨昏忧乐每相亲。</p>
          <p className="welcome">您好，<span className="mainData">「{user.userName || user.userNumber}」</span>。欢迎回顾这些日子来您珍藏的每一本书，每一份记录筑成的这份数据。</p>
        </div>
        <Divider/> 
        <ReactEcharts
            className="libCharts"
            option={this.getLibOption()}
            style={{height: '350px', width: '360px', marginLeft:'30px'}}
            />
        <div className="bookCnt">
          <p className="totalText">
            您过去一共收集了<span className="mainData">「{this.state.books.length}」</span>本书。
            <br/>
            一共创建了<span className="mainData">「{this.state.librarys.length}」</span>个图书集。分别是：
            <ul>{
                this.state.librarys.map(item => {
                return (<li>{item.libName} --- 存放位置{item.libLocation}</li>)
                })
             }</ul>
          </p>
        </div>
        <Divider/> 
        <div className="bookType">
          <p className="totalText">您过去在收集的图书类别主要集中在<span className="mainData">「{maxBooktype || '小说'}」</span>。
            <br/>一共收集了<span className="mainData">「{ maxType }」</span>本{maxBooktype || '小说'}。
          </p>
          <p className="totalText"></p>
        </div>
        <ReactEcharts
          className="typeCharts"
          option={this.getBookTypeOption()}
          style={{height: '350px', width: '400px',marginLeft:'250px'}}
          />
        <Divider/> 
        <div className="progress">
          <ReactEcharts
            className="progressCharts"
            option={this.getProgressOption()}
            style={{height: '400px', width: '500px',marginRight:'150px'}}
            />
          {/* <p className="totalText">您过去在收集的图书类别主要集中在<span className="mainData">「小说」</span></p> */}
        </div>
        
        <ReactEcharts
          option={this.getTimeOption()}
          style={{height: '400px', width: '400px'}}
          />
      </div>
      
    );
  }
}

export default LibData