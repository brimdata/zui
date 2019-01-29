/* @flow */

import React from "react"
import X from "../icons/x-md.svg"
import classNames from "classnames"

type Props = {
  light?: boolean
}

const CloseButton = (props: Props) => (
  <button
    className={classNames("close-button", {light: props.light})}
    {...props}
  >
    <X />
  </button>
)

export default CloseButton
