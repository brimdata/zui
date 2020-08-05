/* @flow */
import * as React from "react"

export type Styled<Props: Object = {}> = React$ComponentType<{
  ...Props,
  children?: React.Node
}>
