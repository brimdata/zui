/* @flow */
import {isEmpty} from "lodash"
import * as React from "react"

type Props = {children: React.Node, empty: React.Node, array: *[]}

export default function EmptyCheck({children, array, empty}: Props) {
  if (isEmpty(array)) {
    return empty
  } else {
    return children
  }
}
