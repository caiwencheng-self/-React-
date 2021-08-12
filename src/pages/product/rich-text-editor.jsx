// 用来指定商品详情的富文本编辑器组件

import React, { Component } from 'react'
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'  // 引入react-draft-wysiwyg的样式  不然样式会出现问题
import PropTypes from 'prop-types'

export default class RichTextEditor extends Component {
  constructor(props) {
    super()
    const html = props.detail 
    if(html) {  // 如果有对应的html结构的话  就利用ContentState属性进行解析生成
      const contentBlock = htmlToDraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        this.state = {
          editorState,
        }
      }
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),  // 创建一个没有内容的编辑对象
      }
    }
  }
  static propTypes = {
    detail: PropTypes.string
  }
  // state = {
  //   editorState: EditorState.createEmpty(),  // 创建一个没有内容的编辑对象
  // }

  onEditorStateChange = (editorState) => {
    // 输入过程中时时的回调函数
    this.setState({
      editorState,
    })
  }
  getDetail = () => {
    const { editorState } = this.state
    // 返回输入数据对应的html文本
    return draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }

  // 上传图片方法
 uploadImageCallBack = (file) => {
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', '/manage/img/upload')
        const data = new FormData()
        data.append('image', file)
        xhr.send(data)
        xhr.addEventListener('load', () => {
          const response = JSON.parse(xhr.responseText)
          const url = response.data.url
          resolve({data:{  // 这个地方是要传入data属性
            link:url
        }})
        })
        xhr.addEventListener('error', () => {
          const error = JSON.parse(xhr.responseText)
          reject(error)
        })
      }
    );
  }
  render() {
    const { editorState } = this.state
    // editorStyle: 编辑器的样式
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid black',minHeight:'200px',paddingLeft: '10px'}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
        {/* <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        /> */}
      </div>
    )
  }
}