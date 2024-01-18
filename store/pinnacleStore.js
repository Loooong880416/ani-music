import { HYEventStore } from "hy-event-store"
import {getPlayListDetail} from "../service/request/music"

const rankingsMaps = {
    newRanking:3779629,
    originRanking: 2884035,
    upRanking: 19723756
}
const pinnacleStore = new HYEventStore({
    state:{
        newRanking:{},
        originRanking: {},
        upRanking: {}
    },
    actions:{
        fetchRankingDataAction(ctx){
            for(const key in rankingsMaps){
                const id = rankingsMaps[key]
                getPlayListDetail(id).then(res=>{
                    ctx[key] = res.playlist
                })
            }
        }
    }
})

export default pinnacleStore