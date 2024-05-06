import {useSelector} from "react-redux"
import Window from "src/js/state/Window"
import {WorkspaceEntries} from "../workspace-entries"
import {WorkspacePicker} from "../workspace-picker"

export function WorkspacePanel() {
  const workspaceId = useSelector(Window.getWorkspaceId)

  return (
    <>
      <WorkspacePicker />
      <WorkspaceEntries id={workspaceId} />
    </>
  )
}
