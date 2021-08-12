import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Upload, Icon, Modal, message } from 'antd';
import { reqDeleteImg } from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'


// 用于图片上传的功能组件

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export default class PicturesWall extends React.Component {
  static propTypes = {
    imgs: PropTypes.array
  }
  constructor(props) {
    super()
    const fileList = []
    // 如果传入了imgs
    let {imgs} = props
    if(imgs && imgs.length > 0) {
      fileList = imgs.map((img,index) => ({
        uid: -index,  //  每一个file都有唯一的一个id  建议指定为负数
        name: img,  // 图片的文件名
        status: 'done', //  图片的状态： done- 已上传  uploading: 正在上传中  removed: 已删除
        url: BASE_IMG_URL + img, // 基础地址
      }))
    }
    // 初始化状态
    this.state = {
      previewVisible: false,  // 标识是否显示modal
      previewImage: '',  //  大图的url
      fileList // 所有已上传的图片的数组
    }
  }
  // state = {
  //   fileList: [
  //     {
  //       uid: '-1',  //  每一个file都有唯一的一个id  建议指定为负数
  //       name: 'image.png',  // 图片的文件名
  //       status: 'done', //  图片的状态： done- 已上传  uploading: 正在上传中  removed: 已删除
  //       url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  //     },
      // {
      //   uid: '-2',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '-3',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
      // {
      //   uid: '-4',
      //   name: 'image.png',
      //   status: 'done',
      //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // },
  //     {
  //       uid: '-5',
  //       name: 'image.png',
  //       status: 'error',
  //     },
  //   ],
  // }

  // 获取所有已上传图片文件名的数组方法
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }
  
  // 隐藏模态框
  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = async file => {
    // console.log(file,'file');
    // 显示指定的file对应的大图
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    })
  }

  // fileList： 所有已上传对象的数组  file: 当前操作的图片文件(上传/删除) 这个很重要
  handleChange = async ({ fileList,file }) => {
    console.log(fileList,'fileList',file,'file')
    
    // 一旦上传成功，将当前上传的file信息进行修正(name,url)
    if(file.status === 'done') {
      const res = file.response
      if(res.status === 0) {
        message.success('上传图片成功')
        const {name,url} = res.data
        // file.name = name  不应该改file  应该改fileList[fileList.length -1]这样才是对的
        // file.url = url
        file = fileList[fileList.length -1]
        file.name = name
        file.url = url
      }else{
        message.error('上传图片失败')
      }
    }else if(file.status === 'removed') { // 删除图片
      const {data: res} = await reqDeleteImg(file.name)
      if(res.status === 0) {
        message.success('删除图片成功')
      }else{
        message.error('删除图片失败!')  // 状态可以不用管 已经是删除之后的列表了
      }
    }
    // 在操作上传/删除过程中更新fileList状态
    this.setState({ fileList })
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div>Upload</div>
      </div>
    )
    return (
      <div>
        {/* action: 上传的地址,  */}
        <Upload
          action="/manage/img/upload"   /*上传图片的接口地址*/
          accept='image/*'    /*只接受图片的格式*/
          listType="picture-card"   /*上传列表的内建样式，支持三种基本样式 */
          name='image' /*后台请求参数名 */
          fileList={fileList}   /*用来指定所有已上传的图片文件对象的数组 */
          onPreview={this.handlePreview} /*点击查看大图触发的事件 */
          onChange={this.handleChange}
        > 

          {fileList.length >= 8 ? null : uploadButton}
        </Upload>

        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


//  1. 子组件调用父组件的方法： 将父组件的方法以函数的形式传递给子组件，子组件就可以调用
// 2. 父组件调用子组件的方法：通过在父组件ref得到子组件的标签对象(也就是组件对象),调用其方法