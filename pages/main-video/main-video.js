import {
    getTopMv
} from "../../service/request/video"
Page({
    data: {
        videoList: [],
        hasMore: false,
    },
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
    onReachBottom() {
        // 判断是否有更多的数据
        if (!this.data.hasMore) return
        // 如果有再请求
        this.fetchToMv()
    },
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

})