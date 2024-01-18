// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import pinnacleStore from "../../store/pinnacleStore"
import { getPlayListDetail } from "../../service/request/music"

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
        }
    },
    async fetchMenuSongInfo() {
        const res = await getPlayListDetail(this.data.id)
        this.setData({
            songInfo:res.playlist
        })
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