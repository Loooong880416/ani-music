// [00:18.53]I remember when I met you↵
const timeReg = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
export function parseLyric(lrcString){
    const lyricInfosArr = []
    const lyricLines = lrcString.split("\n")
    for(const lineString of lyricLines){
        const result = timeReg.exec(lineString)
        if(!result) continue
        const minute = result[1] * 60 * 1000 //分转毫秒
        const second = result[2] * 1000 //秒转毫秒
        const mSecond = result[3].length === 2 ? result[3] * 10 : result[3] * 1//两位和三位不同的处理
        const time = minute + second + mSecond
        const text = lineString.replace(timeReg,"")
        lyricInfosArr.push({
            text,
            time
        })
    }

    return lyricInfosArr
}