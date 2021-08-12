// 能发送异步ajax请求的函数模块
// 封装axios库  函数的返回值是promise对象
// 优化：统一处理异常   方法：在外层包一个自己创建的promise对象   在请求出错的时候不去reject
import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data={}, type='GET') {
  return new Promise((resolve,reject) => {
    let promise
    // 1. 执行异步ajax请求
    // 2.如果成功了，调用resolve(value)
    if(type === 'GET') {
      promise =  axios.get(url,{ // 配置对象
        params: data,
      }) // 发送get请求
    } else {
      promise = axios.post(url,data)
    }
    promise.then(response => {
      resolve(response)
    })
    .catch(error => {
      message.error("请求出错了:" + error.message)
    })
    // 3.如果失败了，不调用reject(reason),而是提醒异常信息
  })
} 