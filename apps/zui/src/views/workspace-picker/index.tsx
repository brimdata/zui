import {useSelector} from "react-redux"
import {WorkspacePickerHandler} from "./handler"
import Current from "src/js/state/Current"
import {Workspace} from "src/models/workspace"
import {IconButton} from "src/components/icon-button"

export function WorkspacePicker() {
  const handler = new WorkspacePickerHandler()
  const attrs = useSelector(Current.getWorkspace)
  const workspace = attrs ? new Workspace(attrs) : null
  const name = workspace ? workspace.name : "(No Workspace Selected)"

  return (
    <nav className="workspace-picker repel">
      <label>{name}</label>{" "}
      <IconButton iconName="chevron_down" onClick={() => handler.showMenu()} />
    </nav>
  )
}
