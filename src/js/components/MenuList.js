/* @flow */

import React from "react"

type Props = {children: *} // Expected to be <li> tags

// $FlowFixMe
const MenuList = React.forwardRef((props: Props, ref: *) => {
  let {children, ...rest} = props
  return (
    <ul ref={ref} className="menu-list" {...rest}>
      {children}
    </ul>
  )
})

MenuList.displayName = "MenuList"

export default MenuList
