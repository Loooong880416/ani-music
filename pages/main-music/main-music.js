// pages/main-music/main-music.js
import {
    getMusicBanner,
    getPlayListDetail,
    getHotSongList
} from "../../service/request/music"
import {
    querySelect
} from "../../utils/query-select"
import throttle from "../../utils/throttle"
import rankingStore from "../../store/rankingStore"
import pinnacleStore from "../../store/pinnacleStore"

const querySelectThrottle = throttle(querySelect)

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: "",
        banners: [],
        bannerHeight: 150,

        recommendSongs: [],//推荐歌曲
        hotSongList: [],//热门歌单
        recommendMenuList: [],//推荐歌单
        // 巅峰榜数据
        rankingInfos: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.fetchMusiceBanner()
        // this.fetchRecommendSongs()

        rankingStore.onState("rankingSongs", this.handlerRecommendSongs)
        // 发起action
        rankingStore.dispatch("fetchRankingSongAction")
        pinnacleStore.dispatch("fetchRankingDataAction")
        this.fetchHotSongList()

        // 巅峰榜的三个监听
        pinnacleStore.onState("newRanking",this.getRankingHandler("newRanking")) 
        pinnacleStore.onState("originRanking",this.getRankingHandler("originRanking")) 
        pinnacleStore.onState("upRanking",this.getRankingHandler("upRanking")) 

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
    async fetchHotSongList() {
        getHotSongList('全部', 6).then(res => {
            this.setData({
                hotSongList: res.playlists
            })
        })
        getHotSongList('华语', 6).then(res => {
            this.setData({
                recommendMenuList: res.playlists
            })
        })
    },
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

    // 从store中获取数据
    handlerRecommendSongs(value) {
        this.setData({
            recommendSongs: value.slice(0, 6)
        })
    },
    getRankingHandler(type){
        return value => {
            const rank = {...this.data.rankingInfos, [type]: value}
            this.setData({
                rankingInfos: rank
            })
        }
    },
    onUnload(){
        recommendSongs.offState("rankingSongs",this,this.handlerRecommendSongs)
        pinnacleStore.offState("")
    }
})