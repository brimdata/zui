import {useParams} from "react-router"

export default function useLakeId() {
  const {workspaceId} = useParams<{workspaceId: string}>()
  return workspaceId
}
