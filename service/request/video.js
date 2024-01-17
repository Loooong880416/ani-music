// 视频页面的所有接口
import {
    aniRequest
} from "../index"

export function getTopMv(limit = 20, offset = 0) {
    return aniRequest.get({
        url: "/top/mv",
        data: {
            limit, //加载多少条
            offset //偏移量，用于分页
        }
    })
}

// 视频详情
export function getMVUrl(id){
    return aniRequest.get({
        url:"/mv/url",
        data:{
            id
        }
    })
}

// mv信息
export function getMVInfo(mvid){
    return aniRequest.get({
        url:"/mv/detail",
        data:{
            mvid
        }
    })
}

// mv关联的信息
export function getMVRelated(id) {
    return aniRequest.get({
      url: "/related/allvideo",
      data: {
        id
      }
    })
  }