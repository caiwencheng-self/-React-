import React, { Component } from 'react'
import {Link, withRouter} from 'react-router-dom'
import { Menu, Icon,} from 'antd';
import './index.css'
import Logo from '../../assets/images/logo.png'

// 引入全局菜单文件
import menuList from '../../config/menuConfig'

const { SubMenu } = Menu;

// 1.通过左侧菜单跳转路由   解决方法：在meun.Item 中用Link组件包裹
// 2.动态显示菜单列表_map()和递归   备注：很重要
// 3.用了两个语法  使用了map 加上递归调用  方法名：getMenuNodes_map
// 4.用reduce() + 递归调用  :传入两个参数  1. 回调函数  2. 初始值

// withRouter 高阶组件：包装非路由组件，返回一个新的组件  新的组件会向非路由组件传递3个属性：history/ location/ match

class LeftNav extends Component {
  getMenuNodes_map = (menuList) => { // 根据menu的数据数组生成对应的标签数组的方法
    return (menuList.map( item => {
      if(!item.children) {
        return (
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{ item.title }</span>
            </Link>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{ item.title }</span>
              </span>
            }
          >
            { this.getMenuNodes_map(item.children) }
          </SubMenu>
        )
      }
    }))
  }
  getMenuNodes = (menuList) => {
    return menuList.reduce((pre,item) => {
      const path = this.props.location.pathname
      // 向pre添加Menu.Item 或者 SubMenu
      if(!item.children) {
        pre.push((
          <Menu.Item key={item.key}>
            <Link to={item.key}>
              <Icon type={item.icon} />
              <span>{ item.title }</span>
            </Link>
          </Menu.Item>
        ))
      } else {
        // 二级菜单栏自动打开功能的实现
        // 查找一个与当前路径请求匹配的子Item
        const cItem = item.children.find( cItem => {
          return   path.indexOf(cItem.key)===0 // 这个展开的地方需要优化一下  这里暂时没做   cItem.key === path
        })
        // 如果存在，说明当前item的子列表需要打开
        if(cItem) {
          this.openKey = item.key   // this 代表的是组件对象  往组件对象存了一个openKey属性
        }

        pre.push((
          <SubMenu
            key={item.key}
            title={
              <span>
                <Icon type={item.icon} />
                <span>{ item.title }</span>
              </span>
            }
          >
            { this.getMenuNodes(item.children) }
          </SubMenu>
        ))
      }
      return pre
    },[])
  }
  UNSAFE_componentWillMount() { // 在第一次render()之前执行一次  为第一次render()准备数据
     this.menuNodes = this.getMenuNodes(menuList)
  }
  render() {
    // debugger
    // 得到当前路由路径的path
    let path = this.props.location.pathname
    // 此处可以得到需要打开的菜单项的key  也就是this.openKey
    if(path.indexOf('/product') === 0) { // 当前请求的是商品或者商品的子路由
      path = '/product'
    }
    return (
      <div className='left-nav'>
        <Link className='left-nav-header' to='/'>
          <img src={Logo} alt="logo" />
          <h1 style={{color:'white'}}>后台管理</h1>
        </Link>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[path]}
          defaultOpenKeys={[this.openKey]}
        >

          {/* <Menu.Item key="/home">
            <Link to="/home">
              <Icon type="pie-chart" />
              <span>首页</span>
            </Link>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="mail" />
                <span>商品</span>
              </span>
            }
          >
              <Menu.Item key="/category">
                <Link to='/category'>
                  <Icon type="mail" />
                  <span>品类管理</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/product">
                <Link to='/product'>
                  <Icon type="mail" />
                  <span>商品管理</span>
                </Link>
              </Menu.Item>
          </SubMenu> */}
          
          {
            this.menuNodes
          }
        </Menu>
      </div>
    )
  }
}

export default withRouter(LeftNav)
