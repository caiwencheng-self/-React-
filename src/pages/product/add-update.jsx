import React, { Component } from 'react'
import {Card,Form, Input, Cascader, Upload, Button, Icon, message} from 'antd'
import LinkButton from '../../components/Link-button'
import { reqCategorys,reqAddOrUpdateProduct } from '../../api/index'
// import ajax from '../../api/ajax'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const {Item} = Form
const { TextArea } = Input

// const options = [  级联选择器先写的一级假数据
//   {
//     value: 'zhejiang',
//     label: 'Zhejiang',
//     isLeaf: false,
//   },
//   {
//     value: 'jiangsu', 
//     label: 'Jiangsu',
//     isLeaf: false,
//   },
//   {
//     value: 'jiangsu',
//     label: 'Jiangsu',
//     isLeaf: true,
//   },
// ]

// 产品的添加修改和更新的子路由
class ProductAddUpdate extends Component {
  constructor() {
    super()
    this.state = {
      options: [] // 先定义为空数组
    }
    // 创建用来保存ref标识的标签对象的容器
    this.myRef = React.createRef()
    this.myRef2 = React.createRef()
  }
  UNSAFE_componentWillMount() { // DidMount 之前取出
    // 取出携带的数据
    const  product  = this.props.location.state // 如果是添加没有值   否则是有值的
    // console.log(product);
    // 保存是否是更新的标识
    // 保存商品 如果没有保存的是一个空对象   避免了报错
    if(product) {
      this.isUpdate = true
      this.product =  product 
    } else {
      this.isUpdate = false
      this.product =  {}
    }
  }
  componentDidMount() {
    this.getCategorys()
  }
  // 用于加载下一级列表的回调函数
  loadData = async selectedOptions => {  // 级联选择器动态加载二级数据
    // 得到的选择option对象
    const targetOption = selectedOptions[0]
    // 显示的loading效果
    targetOption.loading = true

    // 根据选中的分类，请求获取分类二级列表
    const subCategorys = await this.getCategorys(targetOption.value)


    // 隐藏loading
    targetOption.loading = false
    if(subCategorys && subCategorys.length>0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map( c => ({
        value: c._id,
        label: c.name,
        isLeaf: true, // 是叶子,二级分类后面没有3级分类了
      }))
      // 关联到当前的options
      targetOption.children = childOptions
    } else {
      targetOption.isLeaf = true // 发现没有二级分类
    }

    // 模拟请求异步获取二级列表数据,并更新
    // setTimeout(() => {
    //   // 隐藏loading
    //   targetOption.loading = false
    //   targetOption.children = [
    //     {
    //       label: `${targetOption.label} Dynamic 1`,
    //       value: 'dynamic1',
    //       isLeaf: true,
    //     },
    //     {
    //       label: `${targetOption.label} Dynamic 2`,
    //       value: 'dynamic2',
    //       isLeaf: true,
    //     },
    //   ]
    //   // 更新options状态
    //   this.setState({
    //     options: [...this.state.options], // 此处注意需要用展开运算符来改变数组
    //   })
    // }, 1000);
  }
  initOptions = async (categorys) => {
    // 根据categorys生成options数组
    const options  = categorys.map( c => ({  //  此处注意使用数组的map方法  返回一个一个options那样的对象
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }))

    // 如果是一个二级分类商品的更新   点击修改按钮进来的时候
    const {isUpdate, product} = this
    const {pCategoryId,categoryId} = product
    if(isUpdate && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId)
      // 生成下拉列表的options
      const childOptions = subCategorys.map( c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      
      // 找到当前商品对应的一级options
      const targetOption = options.find( option => option.value === pCategoryId)

      // 关联到对应的一级分类列表的children上  关联到当前的options
      targetOption.children = childOptions
    }
    // 更新options状态
    this.setState({
      options
    })
  }
  // 异步获取一级/二级分类列表，并显示
  // async 函数的返回值是一个新的promise对象， promise的结果和值由async的结果来决定
  getCategorys = async (parentId) => {
    const {date:res} = await reqCategorys(parentId) 
    if(res.status === 0) {
      const category = res.data
      // 如果是一级分类列表
      if(parentId === '0') {
        this.initOptions(category) // 获取的是一级分类列表
      }else { // 二级列表
        return category  // 返回二级列表  ===> 当前async函数返回的promise就会成功且value为 category
      }
      
    }
  }
  onSubmit() { // 提交按钮
    // 进行表单验证  如果通过了, 才发送请求
    this.props.form.validateFields(async (err,value) => {
      if(!err) { // 如果err没有值  则代表验证通过
        const imgs = this.myRef.current.getImgs()
        const detail = this.myRef2.current.getDetail()
        // console.log(imgs,'imgs',detail,'detail');
        // console.log('发送请求');

        // 收集数据并分装成product 对象
        const {name,desc,price,categoryIds} = value
        let pCategoryId, categoryId
        if(categoryIds.length === 1) {
          pCategoryId = '0'
          categoryId = categoryIds[0]
        }else{
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        }
        const product = {
          name,
          desc,
          price,
          imgs,
          detail,
          pCategoryId,
          categoryId
        }
        // 如果是更新需要添加_id
        if(this.isUpdate) {
          product._id = this.product._id
        }
        const {data:res} = await reqAddOrUpdateProduct(product)
        // 调用接口请求函数去添加更新
         if(res.status === 0) {
           message.success(`${this.isUpdate?'更新':'添加'}商品成功!`)
           this.props.history.goBack()
         }else {
          message.success(`${this.isUpdate?'更新':'添加'}商品失败!`)
         }
        // 根据结果展示
      }
    })
  }
  validatePrice(rule,value,callback) { // 验证价格的自定义规则函数
     // callback() 验证通过
    // callback(’xxxxx) 验证失败,并指定提示的文本
    if(value * 1 > 0) {
      callback() // 验证通过
    }else {
      callback('价格必须大于0')
    }
  }
  render() {
    const {isUpdate,product} = this
    const {pCategoryId, CategoryId,imgs,detail} = product
    const categoryIds = []  // 进来接受级联分类的id
    if(isUpdate) {
      if(pCategoryId === '0') {
        categoryIds.push(CategoryId)
      }else {
        categoryIds.push(pCategoryId)
        categoryIds.push(CategoryId)
      }
    }
    // 左侧图标主题
    const title = (
      <span>
        <LinkButton onClick={() => this.props.history.goBack()}>
          <Icon type='arrow-left' style={{fontSize: '20px'}}></Icon>
          <span style={{fontSize: '20px', marginLeft: '10px'}}>{isUpdate? '修改商品':'添加商品'}</span>
        </LinkButton>
      </span>
    )
    // 指定Item 布局的配置对象
    const formItemLayout = {
      labelCol: { span: 2 }, // 左侧label的宽度
      wrapperCol: { span: 8 }, // 指定右侧包裹的宽度
    }
    // 取出form对象
    const { getFieldDecorator } = this.props.form
    return (
      <Card title={title}>
        <Form {...formItemLayout} >
          <Item label='商品名称'>
          {
            getFieldDecorator('name',{
              initialValue: product.name,
              rules: [
                { required: true, whitespace:true,message: '必须输入商品名称'},
              ]
            })(
              <Input placeholder='请输入商品名称'/>
            )
          }
          </Item>
          <Item label='商品描述'>
          {
            getFieldDecorator('desc',{
              initialValue: product.desc,
              rules: [
                { required: true, whitespace:true,message: '情输入商品的描述'},
              ]
            })(
              <TextArea placeholder="请输入商品描述" autoSize={{ minRows: 2, maxRows: 6 }} />
            )
          }
          </Item>
          <Item label='商品价格'>
          {
            getFieldDecorator('price',{
              initialValue: product.price,
              rules: [
                { required: true, whitespace:true,message: '必须输入商品价格'},
                {validator: this.validatePrice.bind(this)}
              ]
            })(
              <Input type='number' placeholder='请输入商品名称' addonAfter="元"/>
            )
          }
          </Item>
          <Item label='商品分类'>
          {
            getFieldDecorator('categoryIds',{
              initialValue: [], // 初始值必须是一个数组
              rules: [
              ]
            })(
              <Cascader
              placeholder='请指定商品分类'
              options={this.state.options} // 需要显示的列表数据数组
              loadData={this.loadData} // 当选择某一个列表项， 加载下一级列表的监听回调
              />
            )
          }
          </Item>
          <Item label='商品图片'>
            <PicturesWall ref={ this.myRef }/>
          </Item>
          <Item 
          label='商品详情'
          labelCol= { {span: 2} } // 左侧label的宽度
          wrapperCol= { {span: 20} } // 指定右侧包裹的宽度
          >
            <RichTextEditor ref={ this.myRef2 } detail={detail}/>
          </Item>
          <Item  labelCol= { {span: 2} }>
            <Button type='primary' onClick={this.onSubmit.bind(this)} style={{marginLeft: '68px'}}>提交</Button>
          </Item>
        </Form>
      </Card>
    )
  }
}

export default Form.create()(ProductAddUpdate)