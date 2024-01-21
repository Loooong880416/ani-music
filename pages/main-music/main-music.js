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
import playerStore from "../../store/playStore"
import pinnacleStore, { rankingsMaps } from "../../store/pinnacleStore"

const querySelectThrottle = throttle(querySelect)
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        screenWidth: 375,
        searchValue: "",
        banners: [],
        bannerHeight: 0,

        recommendSongs: [],//推荐歌曲
        hotSongList: [],//热门歌单
        recommendMenuList: [],//推荐歌单
        // 巅峰榜数据
        rankingInfos: {},
        isRankingData: false,

        currentSong: {}, //当前正在播放的歌曲
        isPlaying: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad() {
        this.fetchMusiceBanner()
        // this.fetchRecommendSongs()

        rankingStore.onState("rankingSongsInfo", this.handlerRecommendSongs)
        // 发起action
        rankingStore.dispatch("fetchRankingSongAction")
        pinnacleStore.dispatch("fetchRankingDataAction")
        this.fetchHotSongList()

        // 巅峰榜的三个监听
        for (const key in rankingsMaps) {
            pinnacleStore.onState(key, this.getRankingHandler(key))
        }

        playerStore.onStates(["currentSong", "isPlaying"], this.handlePlayInfos)

        // 获取屏幕的尺寸
        this.setData({ screenWidth: app.globalData.screenWidth })
    },
    //   轮播图
    async fetchMusiceBanner() {
        const res = await getMusicBanner()
        this.setData({
            banners: res.banners
        })
    },
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
            url: '/pages/detail-song/detail-song?type=recommend',
        })
    },
    onSongItemTap(event) {
        const index = event.currentTarget.dataset.index
        playerStore.setState("playSongList", this.data.recommendSongs)
        playerStore.setState("playSongIndex", index)
    },
    onPlayOrPauseBtnTap() {
        playerStore.dispatch("playMusicStatusAction")
    },
    onPlayBarAlbumTap() {
        wx.navigateTo({
          url: '/packagePlayer/pages/music-player/music-player',
        })
      },

    // 从store中获取数据
    handlerRecommendSongs(value) {
        if (!value.tracks) return
        this.setData({
            recommendSongs: value.tracks.slice(0, 6)
        })
    },
    getRankingHandler(type) {
        return value => {
            if (!value.name) return
            if (!this.isRankingData) {
                this.setData({
                    isRankingData: true
                })
            }
            const rank = { ...this.data.rankingInfos, [type]: value }
            this.setData({
                rankingInfos: rank
            })
        }
    },
    handlePlayInfos({ currentSong, isPlaying }) {
        if (currentSong) {
            this.setData({ currentSong })
        }
        if (isPlaying !== undefined) {
            this.setData({ isPlaying })
        }
    },
    onUnload() {
        recommendSongs.offState("rankingSongsInfo", this.handlerRecommendSongs)
        pinnacleStore.offState("")

        playerStore.offStates(["currentSong", "isPlaying"], this.handlePlayInfos)
    }
})