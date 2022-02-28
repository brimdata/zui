import {map} from "lodash"
import {useSelector} from "react-redux"
import Queries from "src/js/state/Queries"
import RemoteQueries from "src/js/state/RemoteQueries"
import DraftQueries from "src/js/state/DraftQueries"
import TreeModel from "tree-model"
import {Query} from "src/js/state/Queries/types"

export const useQueryIdNameMap = () => {
  const localRaw = useSelector(Queries.raw)
  const remoteRaw = useSelector(RemoteQueries.raw)
  const draftRaw = map<Query>(useSelector(DraftQueries.raw), (q) => q.name)

  const idNameMap = {...draftRaw}
  new TreeModel({childrenPropertyName: "items"}).parse(localRaw).walk((n) => {
    if (!("items" in n.model)) {
      idNameMap[n.model.id] = n.model.name
    }
    return true
  })
  new TreeModel({childrenPropertyName: "items"}).parse(remoteRaw).walk((n) => {
    if (!("items" in n.model)) {
      idNameMap[n.model.id] = n.model.name
    }
    return true
  })

  return idNameMap
}
