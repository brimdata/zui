/* @flow */

import React from "react"

type Props = {children: *} // Expected to be <li> tags

// $FlowFixMe
const MenuList = React.forwardRef((props: Props, ref: *) => {
  return (
    <ul ref={ref} className="menu-list">
      {props.children}
    </ul>
  )
})

export default MenuList
