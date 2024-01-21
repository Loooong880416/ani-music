// pages/detail-video/detail-video.js
import {
    getMVUrl, getMVInfo, getMVRelated
} from "../../../service/request/video"
Page({
    data: {
        id: 0,
        mvUrl: '',
        mvInfo:{},
        mvRelate:[]
    },
    onLoad(options) {
        const id = options.id
        this.setData({
            id
        })

        this.fetchMvData()
        this.fetchMvInfo()
        this.fetchMvRelate()
    },
    async fetchMvData() {
        const res = await getMVUrl(this.data.id)
        this.setData({
            mvUrl: res.data.url
        })
    },
    async fetchMvInfo(){
        const res = await getMVInfo(this.data.id)
        this.setData({
            mvInfo:res.data
        })
    },
    async fetchMvRelate(){
        const res = await getMVRelated(this.data.id)
        this.setData({
            mvRelate: res.data
        })
    }
})