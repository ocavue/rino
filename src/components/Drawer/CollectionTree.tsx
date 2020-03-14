import * as icons from "@material-ui/icons"
import { Collection, CollectionContainer, NoteContainer, collectionIconNames } from "src/controller"
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    createStyles,
    makeStyles,
} from "@material-ui/core"
import { StoreContainer } from "src/store"
import React, { useEffect } from "react"
import SvgIcon from "@material-ui/core/SvgIcon"

const useStyles = makeStyles(() => {
    return createStyles({
        listItemIcon: {
            minWidth: 32,
        },
    })
})

const iconMap = {
    Inbox: icons.Inbox,
    Delete: icons.Delete,
}
type SvgIconComponent = typeof SvgIcon
const getIconComponent = (name: collectionIconNames) => {
    const Icon: SvgIconComponent = iconMap[name]
    if (Icon) return Icon
    else return icons.Inbox
}

const CollectionListItem: React.FC<{
    collection: Collection
    selected: boolean
    onClick: () => void
}> = ({ collection, selected, onClick }) => {
    const classes = useStyles()
    const Icon = getIconComponent(collection.icon)
    return (
        <ListItem onClick={onClick} button selected={selected}>
            <ListItemIcon classes={{ root: classes.listItemIcon }}>
                <Icon />
            </ListItemIcon>
            <ListItemText primary={collection.name} />
        </ListItem>
    )
}

const CollectionList: React.FC<{
    collections: Collection[]
    collectionKey: string | null
    setCollectionKey: (value: string | null) => void
}> = ({ collections, collectionKey, setCollectionKey }) => {
    return (
        <List dense>
            {collections.map(collection => (
                <CollectionListItem
                    key={collection.key}
                    selected={collection.key === collectionKey}
                    collection={collection}
                    onClick={() => setCollectionKey(collection.key)}
                />
            ))}
        </List>
    )
}

export const CollectionTree: React.FC = () => {
    const {
        collections,
        collectionKey,
        setCollectionKey,
        initCollections,
    } = CollectionContainer.useContainer()
    const { notes } = NoteContainer.useContainer()
    const {
        state: { setEditable },
    } = StoreContainer.useContainer()

    useEffect(() => {
        initCollections(notes)
    }, [notes, initCollections])

    useEffect(() => setEditable(collectionKey !== "_trash"), [setEditable, collectionKey])

    return (
        <CollectionList
            collections={collections}
            collectionKey={collectionKey}
            setCollectionKey={setCollectionKey}
        />
    )
}
