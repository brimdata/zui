import {useSelector} from "react-redux"
import {useDispatch} from "src/app/core/state"
import Toolbars from "src/js/state/Toolbars"
import {IconName} from "src/app/core/icon-temp"
import {executeCommand} from "src/js/flows/executeCommand"
import {MenuItem} from "src/core/menu"

const usePluginToolbarItems = (toolbarId: string): MenuItem[] => {
  const items = useSelector(Toolbars.allToolbarItems(toolbarId))
  const dispatch = useDispatch()

  return items.map(
    ({label, command, disabled, icon, tooltip, buttonProps}): MenuItem => {
      return {
        label,
        enabled: !disabled,
        iconName: icon as IconName,
        description: tooltip,
        click: () => dispatch(executeCommand(command)),
        htmlAttrs: buttonProps,
      }
    }
  )
}

export default usePluginToolbarItems
