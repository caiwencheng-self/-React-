import React, { Component } from 'react'
import {Form, Input} from 'antd'
import PropsType from 'prop-types'
const Item = Form.Item
class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropsType.string.isRequired,
    setForm: PropsType.func.isRequired,
  }
  UNSAFE_componentWillMount() {
    // 将form对象通过setForm()传递给父组件
    this.props.setForm(this.props.form)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const {categoryName,form} = this.props
    const category_Name = form.getFieldValue('categoryName')
    return (
      <Form>
        <Item>
        {
          getFieldDecorator('categoryName',{
            initialValue: categoryName,  // 指定初始值
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

export default Form.create()(UpdateForm)
