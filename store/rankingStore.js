import { HYEventStore } from "hy-event-store"
import { getPlayListDetail } from "../service/request/music"

const rankingStore = new HYEventStore({
    state: {
        rankingSongsInfo: {}
    },
    actions: {
        fetchRankingSongAction(ctx) {
            getPlayListDetail(3778678).then(res => {
                ctx.rankingSongsInfo = res.playlist
            })
        }
    }
})

export default rankingStore