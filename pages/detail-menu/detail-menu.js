// pages/detail-menu/detail-menu.js
import { getSongMenuTag, getHotSongList } from "../../service/request/music"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        menuList:[]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.fetchAllMenuList()
    },

    //   发送网络请求
    async fetchAllMenuList() {
        const res = await getSongMenuTag()
        const tags = res.tags
        const promiseAll = []
        for(const tag of tags){
           const promise = getHotSongList(tag.name)
           promiseAll.push(promise)
        }
        // 获取到所有数据之后，只调用一次setData
        Promise.all(promiseAll).then(res => {
            this.setData({menuList:res})
        })
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