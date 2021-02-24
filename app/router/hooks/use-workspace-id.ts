import {useParams} from "react-router"

export default function useWorkspaceId() {
  const {workspaceId} = useParams<{workspaceId: string}>()
  return workspaceId
}
