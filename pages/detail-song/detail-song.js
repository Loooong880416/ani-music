// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
import pinnacleStore from "../../store/pinnacleStore"

Page({

    /**
     * 页面的初始数据
     */
    data: {
        songs: [],
        type: "ranking",
        key: "newRanking",

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
    fetchMenuSongInfo() { },
    handleRanking(value) {
        if(this.data.type === "recommend"){
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