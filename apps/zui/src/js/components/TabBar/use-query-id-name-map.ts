import {useSelector} from "react-redux"
import Queries from "src/js/state/Queries"
import RemoteQueries from "src/js/state/RemoteQueries"
import TreeModel from "tree-model"
import {Query} from "src/js/state/Queries/types"
import SessionQueries from "src/js/state/SessionQueries"

export const useQueryIdNameMap = () => {
  const localRaw = useSelector(Queries.raw)
  const remoteRaw = useSelector(RemoteQueries.raw)
  const sessionRaw = useSelector(SessionQueries.raw)

  const idNameMap = {}
  Object.values<Query>(sessionRaw).forEach(
    (session) => (idNameMap[session.id] = session.name)
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
