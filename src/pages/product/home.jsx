import React, { Component } from 'react'
import { Card,Select,Input, Button, Icon, Table, message } from 'antd'
import LinkButton from '../../components/Link-button'
import { reqProducts, reaSearchProducts, reqUpdateStatus } from '../../api/index'
import {PAGE_SIZE} from '../../utils/constants'

const Option = Select.Option

// product默认的子路由组件
export default class ProductHome extends Component {
  constructor() {
    super()
    this.state = {
      product: [ // 商品的数组
        {
          "status": 1,
          "imgs": [
              "image-1559402396338.jpg"
          ],
          "_id": "5ca9e05db49ef916541160cd",
          "name": "联想ThinkPad 翼4809",
          "desc": "年度重量级新品，X390、T490全新登场 更加轻薄机身设计9",
          "price": 65999,
          "pCategoryId": "5ca9d6c0b49ef916541160bb",
          "categoryId": "5ca9db9fb49ef916541160cc",
          "detail": "<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">想你所需，超你所想！精致外观，轻薄便携带光驱，内置正版office杜绝盗版死机，全国联保两年！</span> 222</p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">联想（Lenovo）扬天V110 15.6英寸家用轻薄便携商务办公手提笔记本电脑 定制【E2-9010/4G/128G固态】 2G独显 内置</span></p>\n<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">99999</span></p>\n",
          "__v": 0
        },
        {
            "status": 1,
            "imgs": [
                "image-1559402448049.jpg",
                "image-1559402450480.jpg"
            ],
            "_id": "5ca9e414b49ef916541160ce",
            "name": "华硕(ASUS) 飞行堡垒",
            "desc": "15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)",
            "price": 6799,
            "pCategoryId": "5ca9d6c0b49ef916541160bb",
            "categoryId": "5ca9db8ab49ef916541160cb",
            "detail": "<p><span style=\"color: rgb(102,102,102);background-color: rgb(255,255,255);font-size: 16px;\">华硕(ASUS) 飞行堡垒6 15.6英寸窄边框游戏笔记本电脑(i7-8750H 8G 256GSSD+1T GTX1050Ti 4G IPS)火陨红黑</span>&nbsp;</p>\n<p><span style=\"color: rgb(228,57,60);background-color: rgb(255,255,255);font-size: 12px;\">【4.6-4.7号华硕集体放价，大牌够品质！】1T+256G高速存储组合！超窄边框视野无阻，强劲散热一键启动！</span>&nbsp;</p>\n",
            "__v": 0
        }
      ],
      total: 0, // 商品的总数量 
      searchName: '', // 搜索的关键字名称
      searchType: 'productName', // 根绝那个字段进行搜索
    }
  }
  UNSAFE_componentWillMount() {
    // 在这个地方定义table表格的列数据
    this.initSolums()
  }
  componentDidMount() {
    this.getProducts()
  }
  getProducts = async (pageNum) => { // 获取指定页码的列表显示
    this.pageNum = pageNum // 保存pageNum， 让其他方法可以看的见
    this.setState({ // 显示loading
      loading: true
    })
    const {searchName, searchType} = this.state
    // 如果有搜索关键字有值，说明我们是搜索分页
    let res
    if(searchName) {
       res = await reaSearchProducts({pageNum, pageSize: PAGE_SIZE , searchName, searchType})
    }else { // 一般分页
      res = await reqProducts(pageNum, PAGE_SIZE)
    }
    this.setState({
      loading: false
    })
    if(res.data.status === 0) {
      // 取出分页数据，更新状态，显示分页列表
      const {total, list} = res.data.data
      this.setState({
        total: total,
        product: list,
        loading: false,
      })
    }
  }
  initSolums = () => { // 初始化表格列的数组方法
     this.columns = [
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
      },
      {
        title: '价格',
        dataIndex: 'price', 
        render: (price) => { // 如果指定了dateIndex  render函数的话就会传入price
          return '$' + price
        }
      },
      {
        width: 100,
        title: '状态',
        // dataIndex: 'status',
        render: ({status,_id}) => {
          return (
            <span>
              <Button type='primary' 
                onClick={this.updateStatus.bind(this,_id,status === 1 ? 2 : 1)}>
                {status === 1? '下架':'上架'}
              </Button>
              <span>{status === 1? '在售': '已下架'}</span>
            </span>
          )
        }
      },
      {
        width: 100,
        title: '操作',
        render: (product) => {
          return (
            <span>
              <LinkButton onClick={() => this.props.history.push('/product/detail', {product})}>
                详情
              </LinkButton>
              <LinkButton onClick={() => this.props.history.push('/product/addupdate',product)}>
                修改
              </LinkButton>
            </span>
          )
        }
      },
    ]
  }
  async updateStatus(productId,status) { // 更新指定上平的状态
    const {date:res} = await reqUpdateStatus(productId,status)
    if(res.status === 0) {
      message.success('更新商品成功')
      this.getProducts(this.pageNum)
    }
  }
  render() {
    //  取出状态数据进行显示
    const {product, total, loading, searchName, searchType, } = this.state
    const title = (
      <span>
        <Select style={{width: '150px'}} value={searchType} onChange={value => this.setState({searchType: value})}>
          <Option value='productName'>按名称搜索</Option>
          <Option value='productDesc'>按描述搜索</Option>
        </Select>
        <Input placeholder='关键字' style={{width:'150px',margin:'0 15px'}} value={ searchName } 
        onChange={e => this.setState({
          searchName: e.target.value // 事件对象e
        })}/>
        <Button type='primary' onClick={() => { this.getProducts(PAGE_SIZE)}}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'></Icon>
        添加商品
      </Button>
    )

    return (
      <Card title={title} extra={extra}>
        <Table
        dataSource={product} 
        columns={this.columns}
        rowKey='_id'
        bordered
        pagination={{
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          total: total,
          onChange: this.getProducts
        }}
        loading={loading}
        ></Table>
      </Card>
    )
  }
}
