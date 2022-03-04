import {useDispatch, useSelector} from "react-redux"
import Toolbars from "src/js/state/Toolbars"
import {IconName} from "../../core/icon-temp"
import {ActionButtonProps} from "../action-button"
import {executeCommand} from "src/js/flows/executeCommand"

const usePluginToolbarItems = (toolbarId: string): ActionButtonProps[] => {
  const items = useSelector(Toolbars.allToolbarItems(toolbarId))
  const dispatch = useDispatch()

  return items.map(({label, command, disabled, icon, tooltip, buttonProps}) => {
    return {
      label,
      disabled,
      icon: icon as IconName,
      title: tooltip,
      click: () => dispatch(executeCommand(command)),
      buttonProps
    }
  })
}

export default usePluginToolbarItems
