// 包含应用中所有接口请求函数的模块
// 要求能根据接口文档定义接口请求函数
import { message } from 'antd'
import jsonp from 'jsonp'
import ajax from './ajax'
// 登录
// export function reqLogin(username,password) {
//   return ajax('login',{username,password},'POST')
// }

// "proxy": "http://localhost:5000"
const BASE = ''
export const reqLogin = (username,password) => ajax(BASE + '/login',{username,password},'POST')

// 添加用户
export const reqAddUser = (user) => ajax(BASE + '/manage/user/add',user,'POST')

// 获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BASE + 'manage/category/list',{ parentId })

// 添加分类
export const reqAddCategorys = (categoryName,parentId) => ajax(BASE + 'manage/category/add',{ categoryName, parentId },'POST')

// 更新分类
export const reqUpdateCategorys = ({ categoryId, categoryName }) => ajax(BASE + 'manage/category/update',{ categoryId, categoryName },'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', {pageNum, pageSize})

// 搜索商品分页列表 根据商品名称搜索 searchType: 搜索的类型
export const reaSearchProducts = ({pageNum, pageSize, searchName, searchType}) => ajax(BASE + '/manage/product/search',{pageNum, pageSize, [searchType]: searchName })

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})

// 更新商品的状态（上架或者下架的操作）
export const reqUpdateStatus = (product,status) => ajax(BASE + '/manage/product/updateStatus',{product,status}, 'POST')

// 删除图片接口
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete',{name}, 'POST')

// 添加商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id?'update':'add'),product, 'POST')

// 修改商品接口
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/img/update',product, 'POST')

// 获取所有角色的接口
export const reqRoles = () => ajax(BASE + '/manage/role/list')

// 添加角色的接口
export const reqAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName}, 'POST')

// 更新角色接口
export const reqUpdateRole = (role) => ajax(BASE + '/manage/role/update',role, 'POST')


export const weather = () => {
  return new Promise( (resolve,reject) => {
    let city = 320114
    let key = '01e4a2da05fb351ad0a75b2d73fd6ba3'
    const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}&extensions=base`
    jsonp(url,{},(err,data) => {
      if(!err && data.status === '1') {
        const {weather} = data.lives[0]
        resolve( { weather } )
      }else {
        // 如果失败了
        message.error('获取天气信息失败')
      }
    })
  })
}
