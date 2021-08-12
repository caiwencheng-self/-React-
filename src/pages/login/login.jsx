import React, { Component } from 'react'
import { Form, Icon, Input, Button, message } from 'antd';
import './login.css'
import logo from '../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router';

class Login extends Component {
  // 1.前台表单验证
  // 2.收集表单数据
  validatorPwd(rule, value, callback) { // 对密码进行自定义验证
    if(!value) {
      callback('请输入密码')
    }else if(value.length<4) {
      callback('密码长度不能小于4')
    }else if(value.length > 12) {
      callback('密码长度不能大于12')
    }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
      callback('密码必须是英文、数字、下划线开头')
    }
    callback()
    // callback() 验证通过
    // callback(’xxxxx) 验证失败,并指定提示的文本
  }
  handleSubmit(event) {
    // 阻止事件默认行为
    event.preventDefault()
    // 得到form对象
    const form = this.props.form
    // 获取表单输入项的值
    // const values = form.getFieldsValue()

    // 对所有的表单字段进行校验
    form.validateFields(async (err, values) => {
      // 校验成功
      if (!err) {
        // 请求登录
        const {username, password} = values
        const {data: result} = await reqLogin(username,password)
        if (result.status === 0) { // 登录成功
          message.success('登录成功')  // 提示登录成功
          const user = result.data
          memoryUtils.user = user // 保存到内存中
          storageUtils.saveUser(user) // 保存到localstorage
          this.props.history.replace('/')  // 为什么用replace 不用push尼  因为登录界面我不需要回退回来
        } else { // 登录失败
          message.error(result.msg) // 提醒错误信息
        }
      } else {
        console.log('校验失败')
      }
    })
  }
    render() {
        // 得到强大功能的form对象
        // 判断用户是否登录，如果用户已经登录，自动跳转管理界面
        const user = memoryUtils.user
        if(user && user._id) {
          return <Redirect to='/'></Redirect>
        }
        const form = this.props.form
        const { getFieldDecorator } = form
        return (
            <div className='login'>
                <header className='login_header'>
                    <img src={logo} alt="logo" /> 
                    <h1>React：后台管理项目</h1>
                </header>
                <section className='login_content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
                      <Form.Item>
                        {
                          getFieldDecorator('username',{
                            // 声明式验证 直接使用别人定义好的规则进行验证
                            rules: [
                              { required: true, whitespace:true,message: '用户名必须输入'},
                              { min: 4, message: '用户名至少4位'},
                              { max: 12, message: '用户名最多12位'},
                              { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字、下划线开头'},
                            ],
                            initialValue: 'admin' // 指定初始值
                          })(
                            <Input
                              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                              placeholder="Username"
                              allowClear
                            />,
                          )
                        }
                      </Form.Item>
                      <Form.Item>
                          {
                            getFieldDecorator('password',{
                              rules: [
                                {validator: this.validatorPwd.bind(this)},
                              ],
                            })(
                              <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="密码"
                                allowClear
                              />
                            )
                          }
                      </Form.Item>
                      <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                          登录
                        </Button>
                      </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/**
 * 高阶函数
 * a.接受函数类型的参数
 * b.返回值是函数
 * 常见：
 * 定时器  promise  数组遍历相关的函数  bind
 * 
 * 高阶组件
 * 本质是一个函数
 * 接受一个组件(被包装组件)  返回一个新的组件，包装组件会向被包装组件传入特定的属性
 * 作用：扩展组件的功能
 * 
 * 包装Form组件 生成一个新的组件：From(Login)
 * 新组建会向Form传递一个强大的属性：form
 */

// async 和 await
// 简化promise对象的使用：不用在使用then()来指定成功/失败的回调函数
// 以同步编码方式实现异步流程  没有回调函数了
// 不想要promise, 想要promise异步执行的成功的value数据
const WrapLogin = Form.create({ name: 'normal_login' })(Login);
export default WrapLogin
