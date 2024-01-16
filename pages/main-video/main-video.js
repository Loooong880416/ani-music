import { getTopMv } from "../../service/request/video"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchToMv()
  },
  //发送网络请求的方法
  async fetchToMv(){
    // getTopMv().then(res => {
    //     this.setData({ videoList : res.data})
    // })
    // 将上面这种写法重构成下面这种写法了
    const res = await getTopMv()
    this.setData({videoList:res.data})
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})