import {useMemo} from "react"
import {useSelector} from "react-redux"
import {useParams} from "react-router"
import brim from "src/js/brim"
import Spaces from "src/js/state/Spaces"
import Workspaces from "src/js/state/Workspaces"

export function useLake() {
  const {workspaceId, lakeId} = useParams<{
    workspaceId?: string
    lakeId?: string
  }>()
  const data = useSelector(Spaces.get(workspaceId, lakeId))
  return useMemo(() => (data ? brim.space(data) : null), [data])
}

export function useWorkspace() {
  const {workspaceId} = useParams<{
    workspaceId?: string
  }>()
  return useSelector(Workspaces.id(workspaceId))
}
