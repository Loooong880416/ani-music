// 两种封装方法

// 封装成函数
// export function aniRequest(options) {
//     return new Promise((resolve, reject) => {
//         wx.request({
//             ...options,
//             success: (res) => {
//                 resolve(res.data)
//             },
//             fail: reject
//         })
//     })
// }

// 封装成类(类的话思路和上面那个一样，但是类可以添加很多方法，具备很强的扩展性) -> 创建实例
// 在创建实例的时候，就可以直接把baseUrl传进去
class AniRequest {
    constructor(baseUrl) {
        this.baseUrl = baseUrl
    }
    request(options) {
        const {
            url
        } = options
        return new Promise((resolve, reject) => {
            wx.request({
                ...options,
                url: this.baseUrl + url,
                success: (res) => {
                    resolve(res.data)
                },
                fail: reject
            })
        })
    }
    get(options) {
        return this.request({
            ...options,
            method: "get"
        })
    }
    post(options) {
        return this.request({
            ...options,
            method: "post"
        })
    }
}
export const aniRequest = new AniRequest("http://codercba.com:9002")
