import { aniRequest } from "../index"

// 轮播图
export function getMusicBanner(type = 0){
    return aniRequest.get({
        url:"/banner",
        data:{
            type
        }
    })
}

// 推荐歌曲
export function getPlayListDetail(id){
    return aniRequest.get({
        url:"/playlist/detail",
        data:{
            id
        }
    })
}