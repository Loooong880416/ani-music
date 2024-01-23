// pages/main-profile/main-profile.js
import { menuCollection } from '../../database/index'
import menuStore from '../../store/menuStore'

Page({
    data: {
        userInfo: {},
        isLogin: false,
        tabs: [
            { name: "我的收藏", type: "favor" },
            { name: "喜欢的歌", type: "like" },
            { name: "最近播放", type: "history" },
        ],
        isShowDialog: false,
        menuName: "",
        menuList: []
    },
    onLoad() {
        // 用户是否登录
        const openid = wx.getStorageSync('openid')
        const userInfo = wx.getStorageSync('userInfo')
        this.setData({
            isLogin: !!openid
        })
       
        if (this.data.isLogin) {
            this.setData({ userInfo })
        }

         // 共享歌单数据
         menuStore.onState("menuList",this.handleMenuList)
    },
    onItemTap(event) {
        const item = event.currentTarget.dataset.item
        wx.navigateTo({
            url: `/pages/detail-song/detail-song?type=profile&tabname=${item.type}&title=${item.name}`
        })
    },
    async onUserInfoTap() {
        const profile = await wx.getUserProfile({
            desc: '获取您的头像和昵称',
        })

        // 获取用户的openid
        const loginRes = await wx.cloud.callFunction({
            name: "music-login"
        })
        const openid = loginRes.result.openid

        // 保存在本地
        wx.setStorageSync('openid', openid)
        wx.setStorageSync('userInfo', profile.userInfo)
        this.setData({
            userInfo: profile.userInfo,
            isLogin: true
        })
    },
    onPlusTap() {
        this.setData({ isShowDialog: true })
    },
    async onConfirmTap() {
        const menuName = this.data.menuName

        // 2.模拟歌单数据
        const menuRecord = {
            name: menuName,
            songList: []
        }

        // 3.将歌单记录添加数据库中
        const res = await menuCollection.add(menuRecord)
        if (res) {
            wx.showToast({ title: "添加歌单成功" })
            menuStore.dispatch("fetchMenuListAction")
        }
    },
    onInputChange() {
    },

    handleMenuList(value){
        this.setData({
            menuList:value
        })
    },
    onUnload(){
        menuStore.offState("menuList",this.handleMenuList)
    }
})