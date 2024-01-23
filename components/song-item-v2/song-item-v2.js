// components/song-item-v2/song-item-v2.js
import { favorCollection, likeCollection, menuCollection, db } from "../../database/index"

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        itemData: {
            type: Object,
            value: {}
        },
        index: {
            type: Number,
            value: -1
        },
        menuList: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        actions: ["收藏", "喜欢", "添加歌单"]
    },

    /**
     * 组件的方法列表
     */
    methods: {
        onSongItemTap() {
            const id = this.properties.itemData.id
            wx.navigateTo({
                url: `/packagePlayer/pages/music-player/music-player?id=${id}`,
            })
        },
        onMoreCLick() {
            wx.showActionSheet({
                itemList: this.data.actions,
                fail: () => { },
                success: (res) => {
                    this.handleOperationIndex(res.tapIndex)
                }
            })
        },
        async handleOperationIndex(index) {
            let res = null
            let title = 0
            switch (index) {
                case 0:
                    res = await favorCollection.add(this.properties.itemData)
                    title = '收藏'
                    break
                case 1:
                    res = await likeCollection.add(this.properties.itemData)
                    title = '喜欢'
                    break
                case 2:
                    const names = this.properties.menuList.map(item => item.name)
                    wx.showActionSheet({
                        itemList: names,
                        success: (res) => {
                            const menuIndex = res.tapIndex
                            this.handMenuIndex(menuIndex)
                        }
                    })
                    return
            }
            if (res) {
                wx.showToast({
                    title: `${title}成功`,
                })
            }
        },
        async handMenuIndex(index) {
            // 1.获取要添加进去的歌单
            const menuItem = this.properties.menuList[index]

            // 2.向menuItem歌单中songList中添加一条数据
            const data = this.properties.itemData
            const cmd = db.command
            const res = await menuCollection.update(menuItem._id, {
                songList: cmd.push(data)
            })
            if (res) {
                wx.showToast({
                    title: '歌曲添加至歌单成功',
                })
            }
        },
    },
    options: {
        addGlobalClass: true
    },
})