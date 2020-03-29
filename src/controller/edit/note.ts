import { DocumentReference, DocumentSnapshot, Timestamp, firebase } from "../firebase"
import { generateRandomId } from "src/utils"
import { notesCollection } from "../firebase"

interface NoteData {
    uid: string
    content: string
    deleted: boolean
    createTime: Timestamp
    updateTime: Timestamp
    deleteTime: Timestamp | null
}

export enum NoteType {
    Local = 1,
    Server,
}

async function createNote(data: NoteData): Promise<DocumentSnapshot> {
    const ref = await notesCollection.add(data)
    const snapshot = await ref.get()
    return snapshot
}

const defaultNoteContent = "# \n\n"

type DeleteOption = { type: "hard" | "soft" }

abstract class BaseNote {
    public readonly key: string // An unique constant.
    public abstract get type(): NoteType
    public abstract get id(): string
    public abstract get createTime(): Timestamp
    public abstract get updateTime(): Timestamp
    public abstract get deleteTime(): Timestamp | null
    public abstract get deleting(): boolean
    public abstract get deleted(): boolean
    protected thumbnailContent: string | null = null

    public constructor() {
        this.key = generateRandomId()
    }

    public abstract get content(): string
    public abstract set content(value: string)

    public abstract upload(): Promise<void>

    public abstract delete(option: DeleteOption): Promise<void>

    public get thumbnail() {
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
}

class FirebaseNote extends BaseNote {
    private firebaseId = ""
    private data: NoteData
    private snapshotPromise: Promise<DocumentSnapshot>
    private referencePromise: Promise<DocumentReference>
    public deleting = false
    public type = NoteType.Server

    constructor(uid: string, snapshot?: DocumentSnapshot) {
        super()
        if (snapshot) {
            this.data = {
                uid: uid,
                content: snapshot.get("content"),
                createTime: snapshot.get("createTime"),
                updateTime: snapshot.get("updateTime"),
                deleteTime: snapshot.get("updateTime") || null,
                deleted: snapshot.get("deleted") || false,
            }

            this.snapshotPromise = Promise.resolve(snapshot)
            this.firebaseId = snapshot.ref.id
        } else {
            this.data = {
                uid: uid,
                content: defaultNoteContent,
                createTime: firebase.firestore.Timestamp.now(),
                updateTime: firebase.firestore.Timestamp.now(),
                deleteTime: null,
                deleted: false,
            }

            // Insert a new Note document in firebase
            this.snapshotPromise = createNote(this.data)
            this.snapshotPromise.then((snapshot) => (this.firebaseId = snapshot.ref.id))
        }
        this.referencePromise = this.snapshotPromise.then((snap) => snap.ref)
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
    get createTime(): Timestamp {
        return this.data.createTime
    }
    get updateTime(): Timestamp {
        return this.data.updateTime
    }
    get deleteTime(): Timestamp | null {
        return this.data.deleteTime
    }
    get deleted(): boolean {
        return this.data.deleted
    }
    async upload() {
        if (this.deleting) return
        console.debug(`Uploading note ${this.id}`)
        const ref = await this.referencePromise
        await ref.update({
            content: this.content,
            updateTime: this.updateTime,
            deleteTime: this.deleteTime,
            deleted: this.deleted,
        })
    }
    async delete(option: DeleteOption) {
        if (this.deleting) return
        console.debug(`Deleting note ${this.id}. options:`, option)
        this.deleting = true
        if (option.type === "hard") {
            const ref = await this.referencePromise
            ref.delete()
        } else if (option.type === "soft") {
            this.data.deleted = true
            this.upload()
        }
    }
}

class LocalNote extends BaseNote {
    deleting: boolean
    id: string
    _content: string
    createTime: Timestamp
    updateTime: Timestamp
    deleteTime: Timestamp | null
    deleted: boolean
    type = NoteType.Local

    constructor(content: string = defaultNoteContent) {
        super()
        this._content = content
        this.id = this.key
        this.deleting = false
        this.createTime = this.updateTime = firebase.firestore.Timestamp.now()
        this.deleted = false
        this.deleteTime = null
    }

    get content(): string {
        return this._content
    }
    set content(value: string) {
        this._content = value
        this.thumbnailContent = null
    }
    async upload() {
        return Promise.resolve()
    }
    async delete(option: DeleteOption) {
        this.deleting = true
        this.deleted = true
        return Promise.resolve()
    }
}

class ImmutableNoteWrapper {
    static new(
        params:
            | {
                  type: NoteType.Local
                  content?: string
              }
            | {
                  type?: NoteType.Server
                  uid: string
                  snapshot?: DocumentSnapshot
              },
    ) {
        switch (params.type) {
            case NoteType.Local:
                return new ImmutableNoteWrapper(new LocalNote(params?.content))
            case NoteType.Server:
            default:
                return new ImmutableNoteWrapper(new FirebaseNote(params.uid, params.snapshot))
        }
    }

    readonly local: boolean
    private constructor(private note: BaseNote) {
        this.note = note
        this.local = note.type === NoteType.Local
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
        return this.note.updateTime
    }
    get deleted() {
        return this.note.deleted
    }
    get deleting() {
        return this.note.deleting
    }
    async upload() {
        return await this.note.upload()
    }
    async delete(option: DeleteOption) {
        await this.note.delete(option)
        return new ImmutableNoteWrapper(this.note)
    }
    setContent(content: string): ImmutableNoteWrapper {
        this.note.content = content
        return new ImmutableNoteWrapper(this.note)
    }
}

export { ImmutableNoteWrapper as Note }
