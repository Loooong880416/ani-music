import { HYEventStore } from "hy-event-store"
import { getPlayListDetail } from "../service/request/music"

const rankingStore = new HYEventStore({
    state: {
        rankingSongs: []
    },
    actions: {
        fetchRankingSongAction(ctx) {
            getPlayListDetail(3778678).then(res => {
                ctx.rankingSongs = res.playlist.tracks
            })
        }
    }
})

export default rankingStore