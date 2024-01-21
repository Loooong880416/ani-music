// pages/music-player/music-player.js
import { getSongDetail, getSongLyric } from "../../service/request/player"
import throttle from "../../utils/throttle"
import { parseLyric } from "../../utils/parse-lyric"
import playStore, { audioContext } from "../../store/playStore"

const app = getApp()

const modeNames = ["order", "repeat", "random"]

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        stateKeys: ["currentSong", "durationTime", "currentTime", "lyricInfos", "currentLyricText", "currentLyricIndex", "isPlaying","playModeIndex"],
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,


        lyricString: "",
        statusHeight: 20,
        currentPage: 0,
        contentHeight: 0,
        pageTitles: ["歌曲", "歌词"],
        sliderValue: 0,
        isSliderChanging: false,
        isWaiting: false,
        isPlaying: true,
        lyricScrollTop: 0, //歌词滚动位置
        playSongIndex: 0,//播放列表中当前播放歌曲的索引
        playSongList: [], //播放列表
        isFirstPlay: true,

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
        if(id){
            playStore.dispatch("playMusicWithSongIdAction", id)
        }

        // 获取store共享数据
        playStore.onStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
        playStore.onStates(this.data.stateKeys, this.getPlayerInfosHandler)
    },
    updateProgress: throttle(function (currentTime) {
        if (this.data.isSliderChanging) return
        // 记录当前时间
        // 修改slidervalue
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({
            currentTime,
            sliderValue
        })
    }, 800, { leading: false, trailing: false }),
    // 事件监听
    onNavBackTap() {
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
    onSliderChanging: throttle(function (event) {
        const value = event.detail.value
        const currentTime = value / 100 * this.data.durationTime
        this.setData({
            currentTime
        })
        // 当前正在滑动
        this.data.isSliderChanging = true
    }, 100),
    // 播放暂停
    onPlayOrPauseTap() {
        playStore.dispatch("playMusicStatusAction")
    },
    onPrevBtnTap() {
        playStore.dispatch("playNewMusicAction",false)
    },
    onNextBtnTap() {
        playStore.dispatch("playNewMusicAction")
    },
    onModeBtnTap() {
        playStore.dispatch("changePlayModeAction")
    },


    getPlaySongInfosHandler({ playSongList, playSongIndex }) {
        if (playSongList) {
            this.setData({ playSongList })
        }
        if (playSongIndex !== undefined) {
            this.setData({ playSongIndex })
        }
    },
    getPlayerInfosHandler({
        currentSong,
        currentTime,
        durationTime,
        lyricInfos,
        currentLyricText,
        currentLyricIndex,
        isPlaying,
        playModeIndex
    }) {
        if (currentSong) {
            this.setData({ currentSong })
        }
        if (durationTime !== undefined) {
            this.setData({ durationTime })
        }
        if (currentTime !== undefined) {
            // 根据当前时间改变进度
            this.updateProgress(currentTime)
        }
        if (lyricInfos) {
            this.setData({ lyricInfos })
        }
        if (currentLyricText) {
            this.setData({ currentLyricText })
        }
        if (currentLyricIndex !== undefined) {
            // 修改lyricScrollTop
            this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
        }
        if (isPlaying !== undefined) {
            this.setData({ isPlaying })
        }
        if (playModeIndex !== undefined) {
            this.setData({ playModeName: modeNames[playModeIndex] })
        }
    },
    onUnload() {
        playStore.offStates(["playSongList", "playSongIndex"], this.getPlaySongInfosHandler)
        playStore.offStates(this.data.stateKeys, this.getPlayerInfosHandler)
    }
})