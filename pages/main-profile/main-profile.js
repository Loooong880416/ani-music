// pages/main-profile/main-profile.js
Page({
    data:{
        userInfo:{},
        isLogin:false,
    },
    onLoad(){
        // 用户是否登录
        const openid = wx.getStorageSync('openid')
        const userInfo = wx.getStorageSync('userInfo')
        this.setData({
            isLogin: !!openid
        })
        if(this.data.isLogin){
            this.setData({userInfo})
        }
    },
    async onUserInfoTap(){
       const profile = await wx.getUserProfile({
          desc: '获取您的头像和昵称',
        })

        // 获取用户的openid
        const loginRes = await wx.cloud.callFunction({
            name:"music-login"
        })
        const openid = loginRes.result.openid

        // 保存在本地
        wx.setStorageSync('openid', openid)
        wx.setStorageSync('userInfo', profile.userInfo)
        this.setData({
            userInfo:profile.userInfo,
            isLogin: true
        })
    }
})