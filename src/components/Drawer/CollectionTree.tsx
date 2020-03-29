import {
    createStyles,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
} from "@material-ui/core"
import React, { useEffect } from "react"

import { Collection, collectionIconMap, CollectionIconName, EditContainer } from "src/controller"

const useStyles = makeStyles(() => {
    return createStyles({
        listItemIcon: {
            minWidth: 32,
        },
    })
})

const getIconComponent = (name: CollectionIconName) => {
    const Icon = collectionIconMap[name]
    if (Icon) return Icon
    else return collectionIconMap.Label
}

const CollectionListItem: React.FC<{
    testid: string
    collection: Collection
    selected: boolean
    onClick: () => void
}> = ({ testid, collection, selected, onClick }) => {
    const classes = useStyles()
    const Icon = getIconComponent(collection.icon)
    return (
        <ListItem onClick={onClick} button selected={selected} data-testid={testid}>
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
            {collections.map((collection) => (
                <CollectionListItem
                    key={collection.key}
                    testid={`drawer-collection-item-${collection.key}`}
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
        notes,
        collections,
        collectionKey,
        setCollectionKey,
        initCollections,
    } = EditContainer.useContainer()

    useEffect(() => {
        initCollections(notes)
    }, [notes, initCollections])

    return (
        <CollectionList
            collections={collections}
            collectionKey={collectionKey}
            setCollectionKey={setCollectionKey}
        />
    )
}
