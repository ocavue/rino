import { DocumentReference, DocumentSnapshot, Timestamp, firebase } from "./firebase"
import { generateRandomId } from "src/utils"
import { notesCollection } from "./collection"

interface NoteData {
    uid: string
    content: string
    createTime: Timestamp
    updateTime: Timestamp
}

async function createNote(data: NoteData): Promise<DocumentSnapshot> {
    const ref = await notesCollection.add(data)
    const snapshot = await ref.get()
    return snapshot
}

class NoteCore {
    private firebaseId = ""
    private data: NoteData
    private snapshotPromise: Promise<DocumentSnapshot>
    private referencePromise: Promise<DocumentReference>
    private deleting = false
    private thumbnailContent: string | null = null

    readonly key: string // An unique constant.

    constructor(uid: string, snapshot?: DocumentSnapshot) {
        this.key = generateRandomId()
        if (snapshot) {
            this.data = {
                uid: uid,
                content: snapshot.get("content"),
                createTime: snapshot.get("createTime"),
                updateTime: snapshot.get("updateTime"),
            }

            this.snapshotPromise = Promise.resolve(snapshot)
            this.firebaseId = snapshot.ref.id
        } else {
            this.data = {
                uid: uid,
                content: "# \n\n",
                createTime: firebase.firestore.Timestamp.now(),
                updateTime: firebase.firestore.Timestamp.now(),
            }

            // Insert a new Note document in firebase
            this.snapshotPromise = createNote(this.data)
            this.snapshotPromise.then(snapshot => (this.firebaseId = snapshot.ref.id))
        }
        this.referencePromise = this.snapshotPromise.then(snap => snap.ref)
    }

    public get id(): string {
        // id is an empty string if this note is not saved into firebase
        return this.firebaseId
    }

    get content(): string {
        return this.data.content
    }
    set content(value: string) {
        if (this.data.content === value) return
        this.data.content = value
        this.thumbnailContent = null
    }
    get thumbnail() {
        if (this.thumbnailContent === null) {
            const lines = []
            for (const line of this.content.split("\n")) {
                if (line.trim()) lines.push(line.slice(0, 50))
                if (lines.length >= 3) break
            }
            this.thumbnailContent = lines.join("\n")
        }
        return this.thumbnailContent
    }
    get createTime(): Timestamp {
        return this.data.createTime
    }
    get updateTime(): Timestamp {
        return this.data.createTime
    }
    async upload() {
        if (this.deleting) return
        console.debug(`Uploading note ${this.id}`)
        const ref = await this.referencePromise
        await ref.update({
            content: this.content,
            updateTime: this.updateTime,
        })
    }
    async delete() {
        if (this.deleting) return
        console.debug(`Deleting note ${this.id}`)
        this.deleting = true
        const ref = await this.referencePromise
        ref.delete()
    }
}

class ImmutableNoteWrapper {
    static new(uid: string, snapshot?: DocumentSnapshot) {
        const note = new NoteCore(uid, snapshot)
        return new ImmutableNoteWrapper(note)
    }
    private constructor(private note: NoteCore) {
        this.note = note
    }
    get key() {
        return this.note.key
    }
    get id() {
        return this.note.id
    }
    get content() {
        return this.note.content
    }
    get thumbnail() {
        return this.note.thumbnail
    }
    get createTime() {
        return this.note.createTime
    }
    get updateTime() {
        return this.note.createTime
    }
    async upload() {
        return await this.note.upload()
    }
    async delete() {
        return await this.note.delete()
    }
    setContent(content: string): ImmutableNoteWrapper {
        this.note.content = content
        return new ImmutableNoteWrapper(this.note)
    }
}

export { ImmutableNoteWrapper as Note }
