// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/request/player"
import throttle from "../../utils/throttle"
import { parseLyric } from "../../utils/parse-lyric"

const app = getApp()
// 创建播放器
const audioContext = wx.createInnerAudioContext()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        currentSong: {},
        lyricString: "",
        statusHeight: 20,
        currentPage: 0,
        contentHeight: 0,
        currentLyricText: "",
        currentLyricIndex: -1,
        pageTitles: ["歌曲", "歌词"],
        currentTime: 0,
        durationTime: 0,
        sliderValue: 0,
        isSliderChanging: false,
        isWaiting: false,
        isPlaying: true,
        lyricInfos: [],
        lyricScrollTop:0, //歌词滚动位置
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取设备信息
        this.setData({
            contentHeight: app.globalData.contentHeight
        })

        const id = options.id
        this.setData({ id })
        this.fetchMusicDetails()
        this.fetchSongLyric()

        // 播放当前的歌曲
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.autoplay = false

        // 监听播放的进度
        const throttlUpdateProgress = throttle(this.updateProgress, 500, { leading: false })
        audioContext.onTimeUpdate(() => {
            // 没有滑动滑块时更新歌曲的进度
            if (!this.data.isSliderChanging && !this.data.isWaiting) {
                throttlUpdateProgress()
            }

            // 匹配正确的歌词
            if (!this.data.lyricInfos.length) return
            let index = this.data.lyricInfos.length - 1
            for (let i = 0; i < this.data.lyricInfos.length; i++) {
                const info = this.data.lyricInfos[i]
                if (info.time > audioContext.currentTime * 1000) {
                    index = i - 1
                    break;
                }
            }
            if (index === this.data.currentLyricIndex) return
            const currentLyricText = this.data.lyricInfos[index].text
            this.setData({ 
                currentLyricText, 
                currentLyricIndex: index ,
                lyricScrollTop:35 * index
            })
        })
        audioContext.onWaiting(() => {
            audioContext.pause()
        })
        audioContext.onCanplay(() => {
            // audioContext.play()
        })
    },
    updateProgress() {
        // 记录当前时间
        // 修改slidervalue
        const sliderValue = this.data.currentTime / this.data.durationTime * 100
        this.setData({
            currentTime: audioContext.currentTime * 1000,
            sliderValue
        })
    },
    async fetchMusicDetails() {
        const res = await getSongDetail(this.data.id)
        this.setData({
            currentSong: res.songs[0],
            durationTime: res.songs[0].dt
        })
    },
    // 解析歌词
    async fetchSongLyric() {
        const res = await getSongLyric(this.data.id)
        const lyricString = res.lrc.lyric
        const lyricInfos = parseLyric(lyricString)
        this.setData({ lyricInfos })
    },
    onSwiperChange(event) {
        this.setData({
            currentPage: event.detail.current
        })
    },
    onNavTabItemTap(event) {
        const index = event.currentTarget.dataset.index
        this.setData({
            currentPage: index
        })
    },
    onSliderChange(event) {
        this.data.isWaiting = true
        setTimeout(() => {
            this.data.isWaiting = false
        }, 500)
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        // 设置播放器，播放计算出的时间
        audioContext.seek(currentTime / 1000)
        this.setData({
            currentTime,
            isSliderChanging: false,
            sliderValue: value
        })
    },
    onSliderChanging(event) {
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        this.setData({
            currentTime
        })
        // 当前正在滑动
        this.data.isSliderChanging = true
    },
    // 播放暂停
    onPlayOrPauseTap() {
        if (!audioContext.paused) {
            audioContext.pause()
            this.setData({ isPlaying: false })
        } else {
            audioContext.play()
            this.setData({ isPlaying: true })
        }
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