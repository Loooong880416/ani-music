// pages/main-music/main-music.js
import {
    getMusicBanner,
    getPlayListDetail
} from "../../service/request/music"
import {
    querySelect
} from "../../utils/query-select"
import throttle from "../../utils/throttle"
import rankingStore from "../../store/rankingStore"

const querySelectThrottle = throttle(querySelect)
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: "",
        banners: [],
        bannerHeight: 150,

        recommendSongs: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.fetchMusiceBanner()
        // this.fetchRecommendSongs()
        
        rankingStore.onState("rankingSongs", (value) => {
            this.setData({
                recommendSongs: value.slice(0,6)
            })
        })
        // 发起action
        rankingStore.dispatch("fetchRankingSongAction")
    },
    //   轮播图
    async fetchMusiceBanner() {
        const res = await getMusicBanner()
        this.setData({
            banners: res.banners
        })
    },
    // async fetchRecommendSongs() {
    //     const res = await getPlayListDetail(3778678)
    //     const playlist = res.playlist.tracks.slice(0, 6)
    //     this.setData({
    //         recommendSongs: playlist
    //     })
    // },
    onSearchClick() {
        wx.navigateTo({
            url: '/pages/detail_search/detail_search',
        })
    },
    async onBannerImageLoad() {
        const res = await querySelectThrottle(".banner-image")
        this.setData({
            bannerHeight: res[0].height
        })
    },
    onRecommentMoreClick() {
        wx.navigateTo({
            url: '/pages/detail-song/detail-song',
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