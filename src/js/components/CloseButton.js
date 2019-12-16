/* @flow */

import React from "react"
import X from "./icons/x-md.svg"
import classNames from "classnames"

type Props = {
  light?: boolean
}

const CloseButton = ({light, ...rest}: Props) => (
  <button className={classNames("close-button", {light})} {...rest}>
    <X />
  </button>
)

export default CloseButton
