import {getAllStates} from "../../test/helpers/getTestState"

export default function moveQueriesStateToGlobal(state: any) {
  // Migrate state here
  const mergedQueryMap = {}
  const mergedQueryItems = []
  for (const s of getAllStates(state)) {
    if (!s.queries) continue
    s.queries.items.forEach((q) => {
      // attempt to preserve order of array
      if (!(q.id in mergedQueryMap)) {
        mergedQueryMap[q.id] = q
        mergedQueryItems.push(q)
      }
    })

    delete s.queries
  }

  if (state)
    state.globalState.queries = {
      id: "root",
      name: "root",
      items: mergedQueryItems
    }

  return state
}
