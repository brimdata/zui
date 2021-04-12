import {useSelector} from "react-redux"
import Toolbars from "src/js/state/Toolbars"
import {IconName} from "../../core/Icon"
import {ActionButtonProps} from "../action-button"

const usePluginToolbarItems = (toolbarId: string): ActionButtonProps[] => {
  const items = useSelector(Toolbars.allToolbarItems(toolbarId))

  return items.map(({label, command, disabled, icon, tooltip}) => {
    return {
      label,
      disabled,
      icon: icon as IconName,
      title: tooltip,
      click: () => global.executeCommand(command)
    }
  })
}

export default usePluginToolbarItems
