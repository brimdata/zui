import {matchPath} from "react-router"
import {getAllRendererStates, getGlobalState} from "./utils/getTestState"

function last(array) {
  return array[array.length - 1]
}

export default function migrateToSnapshots(appState: any) {
  /* Main Global State */
  const state = getGlobalState(appState)

  /* Query Versions */
  const versions = state.queryVersions

  /* Queries */
  function lastContents(versions) {
    const lastId = last(versions.ids)
    const {pins, value} = versions.entities[lastId]
    return {pins, value}
  }

  function isFolder(node) {
    return Array.isArray(node.items)
  }

  function visitNode(node) {
    if (isFolder(node)) {
      node.items.forEach(visitNode)
    } else {
      const contents = lastContents(versions[node.id])
      node.pins = contents.pins
      node.value = contents.value
      queries[node.id] = node
    }
  }

  /* Attach pins and value to the Queries */
  const queries = {}
  visitNode(state.queries)

  /* Collect Snapshots From Session History */
  let snapshots = []
  for (const [sessionId, entries] of Object.entries(state.sessionHistories)) {
    for (const entry of entries as any) {
      const isNamed = !!queries[entry.queryId]
      const version = entry.version
      const editor = state.queryVersions[sessionId].entities[version]
      const snapshot = {
        createdAt: editor.ts,
        updatedAt: editor.ts,
        id: editor.version,
        pins: editor.pins,
        value: editor.value,
        sessionId: sessionId,
        queryId: isNamed ? entry.queryId : null,
      }
      snapshots.push(snapshot)
    }
  }

  /* Now Migrate the Paths in the Tab Histories */
  for (const win of getAllRendererStates(appState)) {
    if (!win.tabHistories) continue
    const histories = win.tabHistories.entities
    for (const sessionId in histories as any) {
      const entity = histories[sessionId]
      for (let i = 0; i < entity.entries.length; i++) {
        const path = entity.entries[i]

        const match = matchPath(path, {
          path: "/queries/:queryId/versions/:versionId",
          exact: true,
        })
        /* Find the snapshot */
        if (match) {
          const {queryId, versionId} = match.params as any
          let snapshot = snapshots.find((s) => s.id == versionId)
          if (!snapshot) {
            /* The Snapshot is missing because it has invalid syntax */
            /* But it is stored in the queryVersions */
            /* If it is not stored under the queryId, it is stored under the sessionId. */
            const version =
              state.queryVersions[queryId].entities[versionId] ||
              state.queryVersions[sessionId].entities[versionId]
            const isNamed = !!queries[queryId]
            if (version) {
              snapshot = {
                createdAt: version.ts,
                updatedAt: version.ts,
                id: version.version,
                pins: version.pins,
                value: version.value,
                sessionId: sessionId,
                queryId: isNamed ? queryId : null,
              }
              snapshots.push(snapshot)
            }
          }
          /* Re-write the path */
          const newPath = `/snapshots/${snapshot.id}`
          entity.entries[i] = newPath
        }
      }
      // Remove the nulls
      entity.entries = compact(entity.entries)
      // Set the index to the last one
      entity.index = entity.entries.length - 1
    }
  }

  /* Add the snapshots to the state */
  snapshots = uniqById(snapshots)
  snapshots = sortByCreatedAt(snapshots)
  state.snapshots = toEntityState(snapshots)

  /* Delete everything else from the state */
  delete state.sessionQueries
  delete state.sessionHistories
  delete state.queryVersions

  return appState
}

function uniqById(array) {
  let ids = {}
  let result = []
  for (const item of array) {
    if (ids[item.id]) continue
    ids[item.id] = true
    result.push(item)
  }
  return result
}

function sortByCreatedAt(array) {
  return array.sort((a, b) => {
    if (a.createdAt < b.createdAt) return -1
    else return 1
  })
}

function toEntityState(array) {
  const slice = {ids: [], entities: {}}
  for (const item of array) {
    slice.ids.push(item.id)
    slice.entities[item.id] = item
  }
  return slice
}

function compact(array) {
  return array.filter((item) => !!item)
}
