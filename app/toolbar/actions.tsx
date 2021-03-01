import React from "react"
import {useLocation} from "react-router"
import {ActionButtonProps} from "./action-button"
import ResponsiveActions from "./responsive-actions"

type Props = {actions: ActionButtonProps[]}

export default function Actions({actions}: Props) {
  const location = useLocation()
  return <ResponsiveActions actions={actions} locationKey={location.key} />
}
