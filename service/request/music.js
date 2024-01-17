import { aniRequest } from "../index"

export function getMusicBanner(type = 0){
    return aniRequest.get({
        url:"/banner",
        data:{
            type
        }
    })
}