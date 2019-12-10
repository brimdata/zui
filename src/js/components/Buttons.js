/* @flow */

import * as React from "react"
import classNames from "classnames"

import Caret from "./icons/caret-bottom-sm.svg"
import MenuBarButton from "./MenuBarButton"
import X from "./icons/x-md.svg"

type Children = {
  children: ?React.Node
}

export const ButtonGroup = ({children}: Children) => (
  <div className="button-group">{children}</div>
)

export const ThinButton = ({children, ...rest}: Children) => (
  <button className="thin-button" {...rest}>
    {children}
  </button>
)

export class ThinPicker extends React.Component<{}> {
  render() {
    return (
      <MenuBarButton className="thin-picker" {...this.props}>
        <Caret />
      </MenuBarButton>
    )
  }
}

type Props = {
  className: string
}

export function ExpandButton({
  open,
  className,
  ...props
}: {
  ...Props,
  open: boolean
}) {
  return (
    <div className={classNames("expand-button", className, {open})} {...props}>
      <Caret />
    </div>
  )
}

export function RemoveButton({className, ...props}: Props) {
  return (
    <div className={classNames("remove-button", className)} {...props}>
      <X />
    </div>
  )
}
