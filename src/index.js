// 入口文件
import React from 'react'
import  ReactDOM  from 'react-dom'

import App from './App'
import 'antd/dist/antd.css'

import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils';
// 读取local中保存user,保存到内存中
memoryUtils.user = storageUtils.getUser()

// 将APP组件标签渲染到index页面的div上
ReactDOM.render(<App/>,document.getElementById('root'))