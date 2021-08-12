import React, { Component } from 'react'
import {Form, Input} from 'antd'
// import {PropTypes} from 'prop-types'

const Item = Form.Item
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
    const formItemLayout = {
      labelCol: { span: 6 }, // 左侧label的宽度
      wrapperCol: { span: 14 }, // 指定右侧包裹的宽度
    }
    return (
      <Form layout="horizontal" {...formItemLayout}>
        <Item label='请输入角色名称' colon >
          {
            getFieldDecorator('roleName',{
              initialValue: '',  // 指定初始值
              rules: [
                {required: true, message:'角色名称必须输入'}
              ]
            })(
              <Input placeholder='请输入角色名称'></Input>
            )
          }
        </Item>
      </Form>
    )
  }
}

export default Form.create()(AddForm)
