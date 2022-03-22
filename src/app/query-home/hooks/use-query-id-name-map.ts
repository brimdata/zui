import {useSelector} from "react-redux"
import Queries from "src/js/state/Queries"
import RemoteQueries from "src/js/state/RemoteQueries"
import DraftQueries from "src/js/state/DraftQueries"
import TreeModel from "tree-model"
import {Query} from "src/js/state/Queries/types"
import {DRAFT_QUERY_NAME} from "../utils/brim-query"

export const useQueryIdNameMap = () => {
  const localRaw = useSelector(Queries.raw)
  const remoteRaw = useSelector(RemoteQueries.raw)
  const draftRaw = useSelector(DraftQueries.raw)

  const idNameMap = {}
  Object.values<Query>(draftRaw).forEach(
    (draft) => (idNameMap[draft.id] = DRAFT_QUERY_NAME)
  )
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
