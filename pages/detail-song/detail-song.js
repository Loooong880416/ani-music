// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import pinnacleStore from "../../store/pinnacleStore"
import { getPlayListDetail } from "../../service/request/music"
import playerStore from "../../store/playStore"

const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        songs: [],
        type: "ranking",
        key: "newRanking",
        id: 0,

        songInfo: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const type = options.type
        // this.data.type = type
        this.setData({ type })
        if (type === "ranking") {
            const key = options.key
            this.data.key = key
            pinnacleStore.onState(key, this.handleRanking)
        } else if (type === "recommend") {
            rankingStore.onState("rankingSongsInfo", this.handleRanking)
        } else if (type === "menu") {
            const id = options.id
            this.data.id = id
            this.fetchMenuSongInfo()
        } else if (type === "profile") { //个人中心的tab
            const tabname = options.tabname
            const title = options.title
            this.handleProfileTabInfo(tabname, title)
        }
    },
    async fetchMenuSongInfo() {
        const res = await getPlayListDetail(this.data.id)
        this.setData({
            songInfo: res.playlist
        })
    },
    async handleProfileTabInfo(tabname,title) {
        // 1.动态获取集合
        const collection = db.collection(`c_${tabname}`)
        // 2.获取数据的结果
        const res = await collection.get()
        this.setData({
            songInfo: {
                name: title,
                tracks: res.data
            }
        })
    },
    // wxml事件监听
    onSongItemTap() {
        playerStore.setState("playSongList", this.data.songInfo.tracks)
    },
    handleRanking(value) {
        if (this.data.type === "recommend") {
            value.name = "推荐歌曲"
        }
        this.setData({ songInfo: value })
        wx.setNavigationBarTitle({
            title: value.name,
        })
    },
    onUnload() {
        if (this.data.type === "ranking") {
            pinnacleStore.offState(this.data.key, this.handleRanking)
        } else if (this.data.type === "recommend") {
            rankingStore.offState("rankingSongsInfo", this.handleRanking)
        }
    },
})