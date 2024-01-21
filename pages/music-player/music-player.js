// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/request/player"
import throttle from "../../utils/throttle"
import { parseLyric } from "../../utils/parse-lyric"
import playStore from "../../store/playStore"

const app = getApp()
// 创建播放器
const audioContext = wx.createInnerAudioContext()

const modeNames = ["order", "repeat", "random"]

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
        lyricScrollTop: 0, //歌词滚动位置

        playSongIndex: 0,//播放列表中当前播放歌曲的索引
        playSongList: [], //播放列表
        isFirstPlay: true,

        playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
        playModeName: "order"
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

        // 根据id播放歌曲
        this.setupPlaySong(id)

        // 获取store共享数据
        playStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
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
    // 播放歌曲
    setupPlaySong(id) {
        this.setData({ id })

        this.fetchMusicDetails()
        this.fetchSongLyric()

        // 播放当前的歌曲
        audioContext.stop()
        audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.autoplay = false

        // 监听播放的进度
        if (this.data.isFirstPlay) {
            this.data.isFirstPlay = false
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
                    currentLyricIndex: index,
                    lyricScrollTop: 35 * index
                })
            })
            audioContext.onWaiting(() => {
                audioContext.pause()
            })
            audioContext.onCanplay(() => {
                // audioContext.play()
            })
            audioContext.onEnded(() => {
                // 单曲循环就不切换下一首
                if(audioContext.loop) return

                // 自动切换下一首
                this.changNewSong()
            })
        }

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
    onNavBackTap(){
        wx.navigateBack()
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
    // 拖动滑块节流
    onSliderChanging:throttle(function(event){
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        this.setData({
            currentTime
        })
        // 当前正在滑动
        this.data.isSliderChanging = true
    },100),
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
    onPrevBtnTap() {
        this.changNewSong(false)
    },
    onNextBtnTap() {
        this.changNewSong()
    },
    changNewSong(isNext = true) {
        let index = this.data.playSongIndex
        const length = this.data.playSongList.length

        // 2.根据之前的数据计算最新的索引
        switch (this.data.playModeIndex) {
            case 1: //单曲循环点击下一首也切换
            case 0: // 顺序播放
                index = isNext ? index + 1 : index - 1
                if (index === length) index = 0
                if (index === -1) index = length - 1
                break
            case 2: // 随机播放
                index = Math.floor(Math.random() * length)
                break
        }
        const newSong = this.data.playSongList[index]

        // 将数据回到初始状态
        this.setData({ currentSong: {}, sliderValue: 0, currentTime: 0, durationTime: 0 })
        // 播放新的歌曲
        this.setupPlaySong(newSong.id)
        // 保存最新的索引
        playStore.setState("playSongIndex", index)
    },
    onModeBtnTap() {
        // 1.计算新的模式
        let modeIndex = this.data.playModeIndex
        modeIndex = modeIndex + 1
        if (modeIndex === 3) modeIndex = 0

        // 设置是否是单曲循环
        if (modeIndex === 1) {
            audioContext.loop = true
        } else {
            audioContext.loop = false
        }

        // 2.保存当前的模式
        this.setData({ playModeIndex: modeIndex, playModeName: modeNames[modeIndex] })
    },


    getPlaySongInfosHandler({ playSongList, playSongIndex }) {
        if (playSongList) {
            this.setData({ playSongList })
        }
        if (playSongIndex !== undefined) {
            this.setData({ playSongIndex })
        }
    },
    onUnload() {
        playStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
    }
})