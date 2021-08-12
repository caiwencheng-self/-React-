import React, { Component } from 'react'
import { Redirect,Route,Switch } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import { Layout } from 'antd';
import { Menu } from 'antd';

// 引入admin的二级路由
import Home from '../home/index.js'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar.jsx'
import Line from '../charts/line'
import Pie from '../charts/pie'

// 菜单和菜单项
const { SubMenu } = Menu  
const { Footer, Sider, Content } = Layout;

export default class Admin extends Component {
    render() {
        const user = memoryUtils.user
        // 如果内存中没有存储user ===> 当前没有登录
        if(!user || !user._id) {
            // 自动跳转到登录页
            return <Redirect to="/login"></Redirect>  // 在render函数中 用redirect
        }
        return (
            <Layout style={{ minHeight:'100%' }}>
              <Sider>
                <LeftNav></LeftNav>
              </Sider>
              <Layout>
                <Header>Header</Header>
                <Content style={{margin:'20px', backgroundColor:'white'}}>
                 <Switch>
                   <Route path="/home" cmponent={Home}/>
                   <Route path='/category' component={Category}/>
                   <Route path='/product' component={Product}/>
                   <Route path='/role' component={Role}/>
                   <Route path='/user' component={User}/>
                   <Route path='/charts/bar' component={Bar}/>
                   <Route path='/charts/line' component={Line}/>
                   <Route path='/charts/pie' component={Pie}/>
                   <Redirect to="/home"></Redirect>
                 </Switch>
                </Content>
                <Footer style={{textAlign:'center',color:'#ccc',fontSize:'16px'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
              </Layout>
            </Layout>
        )
    }
}
