import { firebase, DocumentReference, DocumentSnapshot, Timestamp } from "./firebase"

type Listener = (notes: { id: string }[]) => void
type Unsubscribe = () => void

interface NoteData {
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

function generateRandomId(): string {
    // https://stackoverflow.com/a/13403498
    return Math.random()
        .toString(36)
        .substring(2, 15)
}

export class Note {
    private static collection = firebase.firestore().collection("notes")

    private snapshotPromise: Promise<DocumentSnapshot>

    private _id: string
    private data: NoteData

    public constructor(snapshot?: DocumentSnapshot) {
        if (snapshot) {
            this.data = {
                content: snapshot.get("content"),
                createTime: snapshot.get("createTime"),
                updateTime: snapshot.get("updateTime"),
            }

            this.snapshotPromise = Promise.resolve(snapshot)
            this._id = snapshot.ref.id
        } else {
            this.data = {
                content: "default new note content",
                createTime: firebase.firestore.Timestamp.now(),
                updateTime: firebase.firestore.Timestamp.now(),
            }

            // Insert a new Note document in firebase
            this.snapshotPromise = createNote(Note.collection, this.data)

            this._id = generateRandomId()
            this.snapshotPromise.then(snapshot => (this._id = snapshot.ref.id))
        }
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

    public async updateContent(content: string) {
        const updateTime = firebase.firestore.Timestamp.now()
        this.data.content = content
        this.data.updateTime = updateTime
        const ref = await this.refPromise
        await ref.update({ content, updateTime })
    }

    public static async list(): Promise<Note[]> {
        let query = await this.collection.get()
        return query.docs.map(snapshot => new Note(snapshot))
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

    public static async get(id: string): Promise<Note> {
        let snapshot = await this.collection.doc(id).get()
        if (!snapshot.exists) throw new Error(`Can't find note with id = ${id}`)
        return new Note(snapshot)
    }

    public async remove() {
        const ref = await this.refPromise
        await ref.delete()
    }
}
