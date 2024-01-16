import {
    getTopMv
} from "../../service/request/video"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoList: [],
        hasMore: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.fetchToMv()
    },
    //发送网络请求的方法
    async fetchToMv() {
        const res = await getTopMv(20, this.data.videoList.length)

        const newVideoList = [...this.data.videoList, ...res.data]
        this.setData({
            videoList: newVideoList
        })
        this.data.hasMore = res.hasMore
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        // 判断是否有更多的数据
        if (!this.data.hasMore) return
        // 如果有再请求
        this.fetchToMv()
    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    async onPullDownRefresh() {
        // 1，情况之前的数据
        this.setData({
            videoList: []
        })
        this.data.hasMore = true

        // 2.重新请求数据
        await this.fetchToMv()
        // 停止下拉刷新
        wx.stopPullDownRefresh()
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
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})