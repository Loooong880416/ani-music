const db = wx.cloud.database()
class aniCollection {
    constructor(collectionName) {
        this.collection = db.collection(collectionName)
    }

    // 增删改查
    add(data) {
        return this.collection.add({
            data
        })
    }

    remove(condition, isDoc = true) {
        if (isDoc) {
            return this.collection.doc(condition).remove()
        } else {
            this.collection.where(condition).remove()
        }
    }

    update(condition, isDoc = true) {
        if (isDoc) {
            return this.collection.doc(condition).update()
        } else {
            return this.collection.where(condition).update()
        }
    }

    query(offset = 0, size = 20, condition = {}, isDoc = false) {
        if (isDoc) {
            return this.collection.doc(condition).get()
        } else {
            return this.collection.where(condition).skip(offset).limit(size).get()
        }
    }
}

export const favorCollection = new aniCollection("c_favor")
export const likeCollection = new aniCollection("c_like")