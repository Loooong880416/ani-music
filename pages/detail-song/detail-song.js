// pages/detail-song/detail-song.js
import rankingStore from "../../store/rankingStore"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    rankingStore.onState("rankingSongs",this.handleRankingSongs)
  },
  handleRankingSongs(value){
    this.setData({
        songs:value
    })
  },
  onUnload(){
    rankingStore.offState("rankingSongs",this.handleRankingSongs)
  },
})