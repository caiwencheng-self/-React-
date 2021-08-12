import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'
import {PAGE_SIZE} from '../../utils/constants'
import { reqRoles,reqAddRole,reqUpdateRole } from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'  // 格式化当前时间的方法
// 角色路由
export default class Role extends Component {
  constructor() {
    super()
    this.state = {
      roles: [  // 所有角色的列表
        {
          "menus": [
              "/role",
              "/charts/bar",
              "/home",
              "/category"
          ],
          "_id": "5ca9eaa1b49ef916541160d3",
          "name": "测试",
          "create_time": 1554639521749,
          "__v": 0,
          "auth_time": 1558679920395,
          "auth_name": "test007"
      },
      {
          "menus": [
              "/role",
              "/charts/bar",
              "/home",
              "/charts/line",
              "/category",
              "/product",
              "/products"
          ],
          "_id": "5ca9eab0b49ef916541160d4",
          "name": "经理",
          "create_time": 1554639536419,
          "__v": 0,
          "auth_time": 1558506990798,
          "auth_name": "test008"
      },
      {
          "menus": [
              "/home",
              "/products",
              "/category",
              "/product",
              "/role"
          ],
          "_id": "5ca9eac0b49ef916541160d5",
          "name": "角色1",
          "create_time": 1554639552758,
          "__v": 0,
          "auth_time": 1557630307021,
          "auth_name": "admin"
      }
      ],
      loading: false,
      role:{}, // 选中的对象
      isShowAdd: false, // 是否显示添加界面
      isShowAuth: false, // 是否显示设置权限页面
    }
    // 创建一个容器对象
    this.myRef = React.createRef()
  }
  UNSAFE_componentWillMount() {
    this.initColumn()
  }
  componentDidMount() {
    this.getRoles()
  }
  getRoles = async () => {
    const {data: res} = await reqRoles()
    console.log(res,'res')
    if(res.status === 0) { // 得到数据后更新数据
      const roles = res.data
      this.setState({  // 更新数据的方法
        roles
      })
    }else{
      return false
    }
  }
  initColumn = () => {  // 初始化表格列的方法
    this.columns = [
      {
        title:'角色名称',
        dataIndex: 'name',
      },
      {
        title:'创建时间',
        dataIndex: 'create_time',
        render: formateDate
      },
      {
        title:'授权时间',
        dataIndex: 'auth_time',
        render: formateDate
      },
      {
        title:'授权人',
        dataIndex: 'auth_name',
      },
    ]
  }
  onRow(role,index) {  // 点击表格某一行的回调函数
    return {
      onClick: event => { // 点击行
        console.log(role,index,'role')
        this.setState({  // 存取role
          role
        })
      }, 
    }
  }
  onCol(col,index) {  // 点击表格某一列的回调函数
    return {
      onClick: () => { // 点击表头行
        // console.log(col,'col',index,'index')
      }
    }
  }
  addRole() { // 添加角色方法
    // 进行表单验证 只有通过了才向下处理
    this.form.validateFields( async (err,values) => {
      if(!err) {
        // 收集数据
        const {roleName} = values
        this.form.resetFields()
        // 隐藏确认框
        this.setState({
          isShowAdd: false
        })
        // 发送请求
        const {data:res} = await reqAddRole(roleName)
        if(res.status === 0) {
          message.success('添加角色成功')
          // 根据结果更新显示
          // this.getRoles()  此处不需要发送请求状态
          const role = res.data
          // 更新roles状态
          // const roles = this.state.roles // React 不建议这样的写
          // const roles = [...this.state.roles]  // 正确的写法  不建议直接
          // roles.push(role)
          // this.setState({
          //   roles
          // })

          // 更新rolse状态： 基于原本状态数据更新
          // 最推荐的写法   
          this.setState( state => ({
            roles: [...state.roles,role]
          }))

        }else{
          message.error('添加角色失败')
        }
      }
    })
  }
  async updateRole () { // 更新角色方法
    const role = this.state.role
    // 得到最新的menu
    this.setState({
      isShowAuth: false
    })
    const menus = this.myRef.current.getMenus()
    role.menus = menus
    role.auth_time = Date.now() // 当前时间
    role.auth_name = memoryUtils.user.username
    const {data:res} = await reqUpdateRole(role)
    if(res.status === 0) {
      message.success('设置角色权限成功')
      // this.getRoles()
      this.setState({
        roles: [...this.state.roles]
      })
    }else{
      message.error('设置角色权限失败')
    }
  }
  render() {
    const {roles,loading,role,isShowAdd,isShowAuth} = this.state
    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({isShowAdd: true})}>创建角色</Button>&nbsp;&nbsp;&nbsp;
        <Button type='primary' disabled={role._id?false:true} onClick={() => this.setState({isShowAuth: true})}>设置角色权限</Button>
      </span>
    )
    return (
      <Card title={title}>
        <Table
         dataSource={roles}
         pagination={{ // 通过一些配置选项
           defaultPageSize:5,
           showQuickJumper: true
         }}
         columns={this.columns}
         loading={loading}
         rowKey='_id'
         bordered 
         rowSelection={{
          type:'radio',
          selectedRowKeys: [role._id]  // 把role _id传过来就可以选中了
         }}
         onRow={this.onRow.bind(this)}
         onHeaderRow={this.onCol.bind(this)}
        ></Table>
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole.bind(this)}
          onCancel={() => this.setState({isShowAdd: false})}
        >
         <AddForm setForm={(form) => this.form = form}></AddForm>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole.bind(this)}
          onCancel={() => this.setState({isShowAuth: false})}
        >
         <AuthForm role={role} ref={ this.myRef }></AuthForm>
        </Modal>
      </Card>
    )
  }
}
