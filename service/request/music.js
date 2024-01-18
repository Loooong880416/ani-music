import { aniRequest } from "../index"

// 轮播图
export function getMusicBanner(type = 0) {
    return aniRequest.get({
        url: "/banner",
        data: {
            type
        }
    })
}

// 推荐歌曲
export function getPlayListDetail(id) {
    return aniRequest.get({
        url: "/playlist/detail",
        data: {
            id
        }
    })
}

// 热门歌单
export function getHotSongList(cat = "全部", limit = 0, offset = 0) {
    return aniRequest.get({
        url: "/top/playlist",
        data: {
            cat,
            limit,
            offset
        }
    })
}

export function getSongMenuTag(){
    return aniRequest.get({
        url:"/playlist/hot"
    })
}