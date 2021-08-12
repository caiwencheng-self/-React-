import React, {Component} from 'react'
import {Card, Button} from 'antd'
// import ReactEcharts from 'echarts-for-react'  // echarts-for-react  react中使用echarts要用到的插件
import ReactEcharts from 'echarts-for-react'

// 柱状图路由
export default class Bar extends Component {
  constructor() {
    super()
    this.state = {
      sale: [5, 20, 36, 10, 10, 20],  // 销量的数组
      stores: [20, 10, 62, 25, 5, 30] // 库存的数组
    }
  }
  update = () => { // 更新状态数据
    this.setState( state => {
      return ({
        sale: state.sale.map(i => i + 5),
        stores: state.stores.map(j => j - 5)
      })
    })
  }
  // 返回柱状图的配置对象
  getOption = (sale,stores) => {    // echarts的数据需要根据后台返回的数据进行动态更新,一定要把数据放在state里面
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
          data:['销量','库存']  // 销量对应的数据
      },
      xAxis: {
          data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [
        {   // 销量对应数据的数组
          name: '销量',
          type: 'line',
          data: sale
        },
        {   // 库存对应数据的数组
          name: '库存',
          type: 'line',
          data: stores
        }
      ],
      // textStyle:{
      //   color: 'red'
      // }
    }
  }
  render() {
    const {sale,stores} = this.state
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.update}>更新</Button>
        </Card>
        <Card title='柱状图一'>
          <ReactEcharts option={ this.getOption(sale,stores) } />
        </Card>
      </div>
    )
  }
}
