import { firebase, DocumentReference, DocumentSnapshot, Timestamp } from "./firebase"
import { generateRandomId } from "../utils"

type Listener = (notes: { id: string }[]) => void
type Unsubscribe = () => void

interface NoteData {
    uid: string
    content: string
    createTime: Timestamp
    updateTime: Timestamp
}

async function createNote(
    collection: firebase.firestore.CollectionReference,
    data: NoteData,
): Promise<DocumentSnapshot> {
    const ref = await collection.add(data)
    const snapshot = await ref.get()
    return snapshot
}

export class Note {
    private static collection = firebase.firestore().collection("notes")

    private snapshotPromise: Promise<DocumentSnapshot>

    private _id: string
    private data: NoteData
    public thumbnail: string = ""

    public constructor(uid: string, snapshot?: DocumentSnapshot) {
        if (snapshot) {
            this.data = {
                uid: uid,
                content: snapshot.get("content"),
                createTime: snapshot.get("createTime"),
                updateTime: snapshot.get("updateTime"),
            }

            this.snapshotPromise = Promise.resolve(snapshot)
            this._id = snapshot.ref.id
        } else {
            this.data = {
                uid: uid,
                content: "# \n\n",
                createTime: firebase.firestore.Timestamp.now(),
                updateTime: firebase.firestore.Timestamp.now(),
            }

            // Insert a new Note document in firebase
            this.snapshotPromise = createNote(Note.collection, this.data)

            this._id = generateRandomId()
            this.snapshotPromise.then(snapshot => (this._id = snapshot.ref.id))
        }
        this.setThumbnail()
    }

    private get refPromise(): Promise<DocumentReference> {
        return this.snapshotPromise.then(snapshot => snapshot.ref)
    }

    public get id(): string {
        // This value MAY change
        return this._id
    }

    public get content(): string {
        return this.data.content
    }
    public get createTime(): Timestamp {
        return this.data.createTime
    }
    public get updateTime(): Timestamp {
        return this.data.createTime
    }

    private setThumbnail(): void {
        const lines = []
        for (let line of this.content.split("\n")) {
            if (line.trim()) lines.push(line.slice(0, 50))
            if (lines.length >= 3) break
        }
        this.thumbnail = lines.join("\n")
    }

    public async updateContent(content: string): Promise<void> {
        if (this.data.content === content) return Promise.resolve()
        const updateTime = firebase.firestore.Timestamp.now()
        this.data.content = content
        this.data.updateTime = updateTime
        this.setThumbnail()
        const ref = await this.refPromise
        await ref.update({ content, updateTime })
    }

    public static async list(uid: string): Promise<Note[]> {
        let query = await this.collection.where("uid", "==", uid).get()
        return query.docs.map(snapshot => new Note(uid, snapshot))
    }

    public static listen(listener: Listener, type?: "added" | "modified" | "removed"): Unsubscribe {
        if (type) {
            return this.collection.onSnapshot(querySnapshot => {
                let notes = querySnapshot
                    .docChanges()
                    .filter(change => change.type === type)
                    .map(change => ({ id: change.doc.id }))
                listener(notes)
            })
        } else {
            return this.collection.onSnapshot(querySnapshot => {
                let notes = querySnapshot.docs.map(doc => ({ id: doc.id }))
                listener(notes)
            })
        }
    }

    public static async get(id: string, uid: string): Promise<Note> {
        let snapshot = await this.collection.doc(id).get()
        if (!snapshot.exists) throw new Error(`Can't find note with id = ${id}`)
        return new Note(uid, snapshot)
    }

    public async remove() {
        const ref = await this.refPromise
        await ref.delete()
    }
}
