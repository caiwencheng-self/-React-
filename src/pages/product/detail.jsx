import React, { Component } from 'react'
import {Card, Icon, List, } from 'antd'
import LinkButton from '../../components/Link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import { reqCategory } from '../../api/index'

const Item = List.Item

export default class ProductDetail extends Component {
  constructor() {
    super()
    this.state = {
      cName1: '', // 一级分类名称
      cName2: '',  // 二级分类名称
    }
  }
  async componentDidMount() {
    // 得到当前商品的分类id  pCategoryId:一级分类下的id  categoryId: 二级分类下的id
    const {categoryId, pCategoryId} = this.props.location.state.product
    if(pCategoryId === '0') { // 一级分类下的商品
      const {data:res} = await reqCategory(categoryId)
      const cName1 = res.data.name
      this.setState({
        cName1
      })
    }else{  // 二级分类下的商品
      // 通过多个await的方式发送多个请求 效率太低
      // let result1 = await reqCategory(pCategoryId) // 获取一级分类列表
      // let result2 = await reqCategory(categoryId) // 获取二级分类列表
      // const cName1 =  result1.data.data.name
      // const cName2 =  result2.data.data.name

      // 一次性发送多个请求  只有都成功了  才正常处理
      const {date:res} = await Promise.all([ reqCategory(pCategoryId),reqCategory(categoryId)])
      const cName1 = res[0].data.name
      const cName2 = res[1].data.name
      this.setState({
        cName1,
        cName2
      })
    }
  }
  render() {
    // 读取携带过来的状态数据
    const { name, desc, price, detail, imgs } = this.props.location.state
    const {cName1, cName2} = this.state
    const title = (
      <span>
        <LinkButton><Icon type='arrow-left' style={{marginRight: '10px',fontSize: '20px'}} 
        onClick={() => this.props.history.goBack()}></Icon></LinkButton>
        <span>商品详情</span>
      </span>
    )
    return (
      <Card title={title} className='product-detail'>
        <List>
          <Item>
            <span className='left'>商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格:</span>
            <span>{price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类:</span>
            <span>{cName1} {cName2 ? '-->' + cName2: ''}</span>
          </Item>
          <Item>
            <span className='left'>商品图片:</span>
            <span>
              {
                imgs.map(img =>  <img src={BASE_IMG_URL + img} alt="img" className='product-img' key={img}/>)
              }
            </span>
          </Item>
          <Item>
            <span className='left'>商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail}}>
            </span>
          </Item>
        </List>
      </Card>
    )
  }
}
 