import React, { Component } from 'react'
import {Form, Select, Input} from 'antd'
// import {PropTypes} from 'prop-types'

const Item = Form.Item
const Option = Select.Option
class AddForm extends Component {
  // static propTypes = {
  //   categorys: PropTypes.Array.isRequired
  // }
  UNSAFE_componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { categorys,parentId } = this.props
    return (
      <Form layout="horizontal">
        <Item label='一级分类' colon >
          {
            getFieldDecorator('parentId',{
              initialValue: parentId // 指定初始值
            })(
              <Select>
                {
                  categorys.map((c) => <Option value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label='请输入分类名称' colon >
        {
            getFieldDecorator('categoryName',{
              initialValue: '',  // 指定初始值
              rules: [
                {required: true, message:'分类名称必须输入'}
              ]
            })(
              <Input placeholder='请输入分类名称'></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
