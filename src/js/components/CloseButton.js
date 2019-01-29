/* @flow */

import React from "react"
import X from "../icons/x-md.svg"
import classNames from "classnames"

const CloseButton = (props: *) => (
  <button
    className={classNames("close-button", {light: props.light})}
    {...props}
  >
    <X />
  </button>
)

export default CloseButton
