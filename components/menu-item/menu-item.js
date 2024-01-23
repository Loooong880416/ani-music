// components/menu-item/menu-item.js
import { menuCollection } from "../../database/index"
import menuStore from "../../store/menuStore"

Component({

    /**
     * 组件的属性列表
     */
    properties: {
        itemData: {
            type: Object,
            type: {}
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        async onDeleteTap() {
            // 1.获取点击歌单的_id
            const _id = this.properties.itemData._id

            // 2.删除数据
            const res = await menuCollection.remove(_id)

            if (res) {
                wx.showToast({ title: "删除歌单成功" })
                menuStore.dispatch("fetchMenuListAction")
            }
        },
        onShowListTap(){
            wx.navigateTo({
              url: `/pages/detail-song/detail-song?type=mysonglist&mylistid=${this.properties.itemData._id}`,
            })
        }
    }
})