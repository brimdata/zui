import React from "react"
import classNames from "classnames"

import Icon from "src/app/core/icon-temp"

type Props = {
  light?: boolean
  [key: string]: any
}

const CloseButton = ({light, ...rest}: Props) => (
  <button {...rest} className={classNames("close-button", {light})}>
    <Icon name="close" fill="var(--foreground-color)" />
  </button>
)

export default CloseButton
