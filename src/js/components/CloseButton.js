/* @flow */

import React from "react"
import X from "../icons/x-md.svg"

const CloseButton = (props: *) => (
  <button className="close-button" {...props}>
    <X />
  </button>
)

export default CloseButton
