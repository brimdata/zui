/* @flow */
import * as React from "react"

export type Styled<Props = {}> = React$ComponentType<{
  ...Props,
  children?: React.Node
}>
