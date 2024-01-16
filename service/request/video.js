// 视频页面的所有接口
import {
    aniRequest
} from "./index"

export function getTopMv(limit = 20, offset = 0) {
    return aniRequest.get({
        url: "/top/mv",
        data: {
            limit, //加载多少条
            offset //偏移量，用于分页
        }
    })
}