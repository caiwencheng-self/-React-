import React, { Component } from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
const Item = Form.Item
const { TreeNode } = Tree // 引入tree里面的节点

export default class AuthForm extends Component {
  constructor(props) {
    super()
    // 根据传入menus生成checkedKeys初始状态
    const {menus} = props.role
    this.state = {
      checkedKeys: menus
    }
  }

  static propTypes = {
    role: PropTypes.object
  }

  getTreeNodes(menuList) {
    return menuList.map((item,index) => {
      return  (
        <TreeNode title={item.title} key={item.key}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>
      )
    })
  }
  getMenus() {  // 定义的让父组件取子组件的方法
    return this.state.checkedKeys
  }
  onCheck = checkedKeys => {   // 选中某个node时的回调
    console.log('onCheck', checkedKeys)  // 根据角色的value值
    this.setState({ checkedKeys })
  }
  UNSAFE_componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  // 根据新传入的role来更新checkedKeys状态
  componentWillReceiveProps(nextProps) {  // 当组件接受新的属性时自动调用
    const menus = nextProps.role.menus
    this.setState({
      checkedKeys: menus
    })
  }
  render() {
    const {role} = this.props
    const formItemLayout = {
      labelCol: { span: 6 }, // 左侧label的宽度
      wrapperCol: { span: 14 }, // 指定右侧包裹的宽度
    }
    const {checkedKeys} = this.state
    return (
      <div>
        <Item label='请输入分类名称'  {...formItemLayout}>
          <Input value={role.name} disabled></Input>
        </Item>
        <Tree
        checkable
        defaultExpandAll={true}
        checkedKeys={ checkedKeys }
        onCheck={this.onCheck}
        >
        <TreeNode title="平台权限" key="all">
          { this.treeNodes }
          </TreeNode>
        </Tree>
      </div>
    )
  }
}

// tree的属性详解：
// defaultExpandAll: 默认展开所有的子节点  title: 用来做显示  key: 值
// checkedKeys: 选中所有节点的key  是一个数组  和key值是对应的关系  自动会找匹配的选中   改状态数据
// onCheck:选中某个node时的回调