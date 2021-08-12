import React, { Component } from 'react'
import { Card,Table,Button,Icon, message, Modal } from 'antd'
import LinkButton from '../../components/Link-button'
import {reqCategorys, reqUpdateCategorys, reqAddCategorys} from '../../api/index'
import AddForm  from './add-form'
import UpdateForm from './update-form'


// 应用的antD组件  Card Table Button Icon
// 商品分类
export default class CateGory extends Component {
  constructor() {
    super()
    this.state = {
      categorys: [], // 一级分类列表
      loading:false, // 是否正在获取数据中
      parentId: '0', // 当前需要显示分类列表的parentId
      parentName: '', // 当前显示的分类列表的父分类名称
      subCategorys: [], // 子分类的列表
      showStatus: 0, // 标识添加/更新的确认框是否显示 0都不显示  1：显示添加  2：显示更新
    }
  }
  UNSAFE_componentWillMount() { // 在第一次render()之前执行一次  为第一次render()准备数据
    this.initColums()
 }

 componentDidMount() { // 执行异步任务：发送ajax请求
      this.getCategorys()
 }

 // 初始化table列的数组
 initColums = () => {
  this.columns = [  // columns:表格列的具体配项
    {
      title: '分类的名称',      // 每一列的标题
      dataIndex: 'name', // 匹配数据源数组中的哪一项
      key: 'name', // 对应的每一个key
    },
    {
      title: '操作',
      width:300,
      dataIndex: '', // 指定显示数据对应的属性名
      key: 'caozuo',
      render: (categorys,text,index) => { // 指定需要返回的界面标签
        return (
          <span>
            <LinkButton onClick={this.showUpdate.bind(this,categorys)}>修改分类</LinkButton>
            {/* 如何向事件回调函数传递参数；先定义一个匿名函数，在函数调用处理的函数并传入数据 */}
            {this.state.parentId === '0'? <LinkButton onClick={ this.showSubCategorys.bind(this,categorys)}>查看子分类</LinkButton>:null }
          </span>
        )
      }
    },
  ]
 }

 showSubCategorys(categorys) {
   // 先更新状态
   this.setState({  // 注意此处更新状态是异步的
     parentId: categorys._id,
     parentName: categorys.name
   },() => {  // 在状态更新且重新render() 后执行
    //  获取二级分类列表
    this.getCategorys()
   })
 }

// 第一次获取表格的数据
// parentId: 如果没有指定根据状态中的parentID
getCategorys = async (parentId) => {
  // 在发请求前显示loading
  this.setState({
    loading:true
  })
  // const {parentId} = this.state
  parentId = parentId || this.state.parentId
  let {data:res} = await reqCategorys(parentId)  // 注意调用接口的方法会接受promise对象
   // 在请求完成后，隐藏loading
  this.setState({
    loading:false
  }) 
  if(res.status === 0) {
    // 取出分类数组 可能是一级也有可能是二级的列表
    const categorys = res.data
    if(parentId === '0') {
       // 更新一级分类
      this.setState({
        categorys
      })
    }else {
      // 更新二级分类状态
      this.setState({
        subCategorys: categorys
      })
    }
  }else {
    message.error('获取分类列表失败')
  }
}
showSecondSubCategorys() { // 显示一级分类列表
  this.setState({  // 直接重置一下数据，就可以完成二级列表到一级列表的切换
    parentId: '0',
    parentName: '',
    subCategorys: []
  })
}
showUpdate(categorys) { // 点击修改分类显示对话框
  // 保存分类对象
  this.categorys = categorys
  this.setState({
    showStatus: 2
  })
}
handleCancel() { // 点击取消影藏对话框
  // 清除输入数据
  this.form.resetFields()
  // 影藏确认框
  this.setState({
    showStatus: 0
  })
}
showAdd() { // 显示添加的对话框
  this.setState({
    showStatus: 1
  })
}
async addCategorys() { // 添加分类
  // 进行表单验证, 只有通过了才处理
  this.form.validateFields( async (err, values) => {
    if(!err) {
      // 1.隐藏确认框
    this.setState({
      showStatus: 0
    })
  
    // 2.收集数据 提交请求
    const { parentId, categoryName } = values
    const { data:res } = await reqAddCategorys(categoryName,parentId)   // 注意顺序的问题
    this.form.resetFields()  // 清除输入框中的数据
    if(res.status === 0) {
      // 3.重新获取分类列表显示
      // 添加的分类就是当前分类列表下的分类
      if(parentId === this.state.parentId) {
        // 重新获取当前分类列表
        this.getCategorys()
      }else if(parentId === '0') { // 在二级分类列表下添加一级分类项,重新获取一级列表，但不需要显示一级列表
        this.getCategorys()
      }
    }
    }
  })
}
updateCategorys() { // 更新分类
  // 进行表单验证, 只有通过了才处理
  this.form.validateFields( async (err, values) => {
    // 1.隐藏确定框
    this.setState({
      showStatus: 0
    })
    // 准备数据
    const categoryId = this.categorys._id
    const categoryName = values
  
    // 清除输入的数据   重置表单的数据
    this.form.resetFields()
  
   // 2. 发请求更新分类
   const {data:res} = await reqUpdateCategorys({ categoryId, categoryName })
   if (res.status === 0) {
     // 3.更新列表
     this.getCategorys()
   }
  })
}
  render() {
    const extra = (
      <Button icon="plus" type="primary" onClick={this.showAdd.bind(this)}>
        添加
      </Button>
    )
    // 读取状态数据
    const {categorys, loading, parentId, subCategorys, parentName, showStatus} = this.state
    const title = parentId === '0'? '一级分类列表': (
      <span>
        <LinkButton onClick={this.showSecondSubCategorys.bind(this)}>一级分类列表</LinkButton>
        <Icon type='arrow-right' style={{marginRight: '10px'}}></Icon>
        <span>{parentName}</span>
      </span>
    )
    // 读取指定的分类
    const categorys1 = this.categorys || {}  // 如果还没有这个属性的话  先给定一个空对象  不然页面会报错
    return (
      <Card title={title} extra={extra} style={{border: 'none'}}>
        <Table
        dataSource={ parentId=== '0'? categorys: subCategorys}
        pagination={{ // 通过一些配置选项
          defaultPageSize:5,
          showQuickJumper: true
        }}
        columns={this.columns}
        loading={loading}
        rowKey='_id'
        bordered />

        <Modal
          title="添加分类"
          visible={showStatus === 1}
          onOk={this.addCategorys.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
         <AddForm categorys={categorys} parentId={parentId} setForm={(form) => this.form = form}></AddForm>
        </Modal>

        <Modal
          title="修改分类"
          visible={showStatus === 2}
          onOk={this.updateCategorys.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <UpdateForm categoryName={categorys1.name} setForm={(form) => this.form = form}></UpdateForm>
        </Modal>
      </Card>
      
    )
  }
}
