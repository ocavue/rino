import firebase from "./firebase"

const collectionName = "notes"

export async function list() {
    let collection = firebase.firestore().collection(collectionName)
    let query = await collection.get()
    return query.docs.map(doc => ({ id: doc.id }))
}

type Listener = (notes: { id: string }[]) => void
type Unsubscribe = () => void

export function listen(listener: Listener, type?: "added" | "modified" | "removed"): Unsubscribe {
    let collection = firebase.firestore().collection(collectionName)
    if (type) {
        return collection.onSnapshot(querySnapshot => {
            let notes = querySnapshot
                .docChanges()
                .filter(change => change.type === type)
                .map(change => ({ id: change.doc.id }))
            listener(notes)
        })
    } else {
        return collection.onSnapshot(querySnapshot => {
            let notes = querySnapshot.docs.map(doc => ({ id: doc.id }))
            listener(notes)
        })
    }
}

export async function get(id: string) {
    let collection = firebase.firestore().collection(collectionName)
    let doc = await collection.doc(id).get()
    if (!doc.exists) throw new Error(`Can't find note with id = ${id}`)
    let data = doc.data()
    if (!data) throw new Error(`Can't find note data with id = ${id}`)
    // TODO Use an ORM!
    return {
        content: data.content as string,
        createTime: data.createTime,
        updateTime: data.updateTime,
    }
}

export async function create() {
    let collection = firebase.firestore().collection(collectionName)
    let data = {
        content: "",
        createTime: firebase.firestore.Timestamp.now(),
        updateTime: firebase.firestore.Timestamp.now(),
    }
    let doc = await collection.add(data)
    return doc
}

export async function update(id: string, content: string) {
    console.debug("saving:", content)
    let collection = firebase.firestore().collection(collectionName)
    let data = {
        content: content,
        updateTime: firebase.firestore.Timestamp.now(),
    }
    await collection.doc(id).set(data)
}

export async function remove(id: string) {
    console.debug("deleting:", id)
    let collection = firebase.firestore().collection(collectionName)
    await collection.doc(id).delete()
}
