import {aniRequest} from "../index"

// 歌曲详情
export function getSongDetail(ids){
    return aniRequest.get({
        url:"/song/detail",
        data:{
            ids
        }
    })
}

// 歌词信息
export function getSongLyric(id){
    return aniRequest.get({
        url:"/lyric",
        data:{
            id
        }
    })
}