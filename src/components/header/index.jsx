import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import LinkButton from '../Link-button'
import { Modal } from 'antd'
import { weather } from '../../api'
import menuList from '../../config/menuConfig'
import './index.css'

class header extends Component {
  constructor() {
    super()
    this.state = {
      currentTime: formateDate(Date.now()), // 当前时间字符串
      weather: '', // 天气的文本
    }
  }
  componentDidMount() { // 第一次render之后执行  一般在此执行异步操作： 发请求 /启动定时器 
    // 获取当前时间显示
    this.getTime()
    // 获取当前天气显示
    this.getWeather()
  }
  getTime = () => {
    // 每隔一秒更新当前时间
    this.timer = setInterval(() => {
      const currentTime = formateDate(Date.now())
      this.setState({
        currentTime,
      })
    },1000)
  }
  getWeather = async () => {
    const result = await weather()
    this.setState({
      weather: result.weather
    })
  }
  getTitle = () => {
    //得到当前请求路径
    const path = this.props.location.pathname
    let title
    menuList.forEach( item => {
      if(item.key === path) {
        title = item.title
        return title
      }else if(item.children) {
        // 在所有子Item中进行查找
        const cItem = item.children.find(cItem => {
          return  (path.indexOf(cItem.key) === 0)   // cItem.key === path
        }) 
        if(cItem) {
          // 取出他的title
          title = cItem.title
        }
      }
    })
    return title
  }
  Logout() { // 退出登录
    // 显示确认框
    Modal.confirm({
      content:'请问你确定要退出?',
      onOk: () => {
        // 删除保存的user数据
        storageUtils.removeUser()
        memoryUtils.user = {}
        // 路由跳转到登陆界面
        this.props.history.replace('/login')
      }
    })
  }
  componentWillUnmount() {
    clearInterval(this.timer)  // 清除定时器
  }
  render() {
    const {weather, currentTime} = this.state
    const { username } = memoryUtils.user
    const title = this.getTitle()  // 不能放在willMount  不能不会实时更新显示
    return (
      <div className='header'>
       <div className='header-top'>
          <span>欢迎, {username} </span>
          <LinkButton onClick= {this.Logout.bind(this)}>退出</LinkButton>
       </div>
       <div className="header-bottom">
        <div className="header-bottom-left">
          <span>{ title }</span>
        </div>
        <div className="header-bottom-right">
          <span>{ currentTime }</span>
          <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="weather" />
          <span>{ weather }</span>
        </div>
       </div>
      </div>
    )
  }
}

export default withRouter(header)