// 进行local数据存储管理的工具模块
const USER_KEY = 'user_key'
// 解决浏览器中的兼容性处理  store库 直接在github上面搜索  store库可以跨浏览器
export default {
  // 保存user
  saveUser(user) {
    localStorage.setItem(USER_KEY,JSON.stringify(user))
  },
  // 读取user
  getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || '{}' )
  },
  // 删除user
  removeUser() {
    localStorage.removeItem(USER_KEY)
  }
}