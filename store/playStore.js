import { HYEventStore } from "hy-event-store"
import { getSongLyric, getSongDetail } from "../service/request/player"
import { parseLyric } from "../utils/parse-lyric"

// 创建播放器
export const audioContext = wx.createInnerAudioContext()

const playerStore = new HYEventStore({
    state: {
        playSongList: [],
        playSongIndex: 0,

        id: 0,
        currentSong: {},
        currentTime: 0,
        durationTime: 0,
        lyricInfos: [],
        currentLyricText: "",
        currentLyricIndex: -1,
        isFirstPlay: true,

        isPlaying: false,
        playModeIndex: 0, // 0:顺序播放 1:单曲循环 2:随机播放
    },
    actions: {
        playMusicWithSongIdAction(ctx, id) {
            // 原来的数据重置
            ctx.currentSong = {}
            ctx.durationTime = 0
            ctx.durationTime = 0
            ctx.currentLyricIndex = 0
            ctx.currentLyricText = ""
            ctx.lyricInfos = []

            // 保存歌曲id
            ctx.id = id
            ctx.isPlaying = true

            getSongDetail(id).then(res => {
                ctx.currentSong = res.songs[0]
                ctx.durationTime = res.songs[0].dt
            })
            getSongLyric(id).then(res => {
                const lyricString = res.lrc.lyric
                const lyricInfos = parseLyric(lyricString)
                ctx.lyricInfos = lyricInfos
            })

            // 播放当前的歌曲
            audioContext.stop()
            audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
            audioContext.autoplay = false

            // 监听播放的进度
            if (ctx.isFirstPlay) {
                ctx.isFirstPlay = false

                audioContext.onTimeUpdate(() => {
                    // 获取当前播放的时间
                    ctx.currentTime = audioContext.currentTime * 1000
                    // 匹配正确的歌词
                    if (!ctx.lyricInfos.length) return
                    let index = ctx.lyricInfos.length - 1
                    for (let i = 0; i < ctx.lyricInfos.length; i++) {
                        const info = ctx.lyricInfos[i]
                        if (info.time > audioContext.currentTime * 1000) {
                            index = i - 1
                            break;
                        }
                    }
                    if (index === ctx.currentLyricIndex || index === -1) return

                    // 改变歌词滚动页面的位置
                    const currentLyricText = ctx.lyricInfos[index].text
                    ctx.currentLyricText = currentLyricText
                    ctx.currentLyricIndex = index
                })
                // audioContext.onWaiting(() => {
                //     console.log('先暂停')
                //     audioContext.pause()
                // })
                audioContext.onCanplay(() => {
                    audioContext.play()
                    ctx.isPlaying = true
                })
                audioContext.onEnded(() => {
                    // 单曲循环就不切换下一首
                    if (audioContext.loop) return

                    // 自动切换下一首
                    this.dispatch("playNewMusicAction")
                })
            }

        },
        playMusicStatusAction(ctx) {
            if (!audioContext.paused) {
                audioContext.pause()
                ctx.isPlaying = false
            } else {
                audioContext.play()
                ctx.isPlaying = true
            }
        },
        changePlayModeAction(ctx) {
            // 1.计算新的模式
            let modeIndex = ctx.playModeIndex
            modeIndex = modeIndex + 1
            if (modeIndex === 3) modeIndex = 0

            // 设置是否是单曲循环
            if (modeIndex === 1) {
                audioContext.loop = true
            } else {
                audioContext.loop = false
            }

            // 2.保存当前的模式
            ctx.playModeIndex = modeIndex
        },
        playNewMusicAction(ctx, isNext = true) {
            let index = ctx.playSongIndex
            const length = ctx.playSongList.length

            // 2.根据之前的数据计算最新的索引
            switch (ctx.playModeIndex) {
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
            const newSong = ctx.playSongList[index]

            // 播放新的歌曲
            this.dispatch("playMusicWithSongIdAction", newSong.id)
            // 保存最新的索引
            ctx.playSongIndex = index
        }
    }
})

export default playerStore