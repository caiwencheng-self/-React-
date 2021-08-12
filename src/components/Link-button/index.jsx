import React from 'react'
import './index.css'

// 外形
export default function LinkButton(props) {
  // props.children 接受标签的子节点
  return (
    <button {...props} className='link-button'>{props.children}</button>
  )
}
