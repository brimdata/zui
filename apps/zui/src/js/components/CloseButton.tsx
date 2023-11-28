import React from "react"
import classNames from "classnames"

import Icon from "src/components/icon"

type Props = {
  light?: boolean
  [key: string]: any
}

const CloseButton = ({light, ...rest}: Props) => (
  <button {...rest} className={classNames("close-button", {light})}>
    <Icon name="close" fill="var(--fg-color)" />
  </button>
)

export default CloseButton
