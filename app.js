// app.js
App({
    globalData: {
        screenWidth: 375,
        screenHeight: 667,
        statusHeight: 20,
        contentHeight: 500,
    },
    onLaunch() {
        wx.getSystemInfo({
            success: (res) => {
                this.globalData.screenHeight = res.screenHeight
                this.globalData.screenWidth = res.screenWidth
                this.globalData.statusHeight = res.statusBarHeight
                this.globalData.contentHeight = res.screenHeight - res.statusBarHeight - 44
            }
        })

        //   云开发初始化
        wx.cloud.init({
            env: "supercici-dev-5g7uaqmi6630fbad"
        })
    }
})
