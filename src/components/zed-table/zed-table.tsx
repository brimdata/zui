import React from "react"
import {zed} from "packages/zealot/src"
import {Provider} from "./context"
import {Grid} from "./grid"
import classNames from "classnames"
import {TableHandlers} from "./types"
import {useApi} from "./api-hook"

/**
 * TODO LIST

 - [x] The height of the table needs to account for the fixed header
 - [x] The header must scroll left along with the table
 - [x] Resize columns
 - [x] Autosize columns
 - [x] Expand complex values
 - [x] Use robust cell and value ids
 - [x] Configure preview limits in the <ZedValue component />
 - [x] Auto detect the size of the cells
 - [x] Multi-shape design?
 - [ ] Infinite Scroll
 - [x] Header groups for nested records
 - [x] Figure out an id scheme for nexted columns
 - [ ] Keep track of which records you want to expand headers for
 - [x] Make sure the styles are the same when you are measuring (font-family)
 - [x] Store the columns widths per shape, since zed identities are stable
 - [x] Re-style the header
 - [ ] Add the right click menus
 - [ ] Cell selection to match google docs
 - [ ] Right click on selected cells menu
 - [ ] Column Visibility
 - [ ] Column Ordering
 - [ ] Fix button styles and border colors
 - [ ] Fix style around zeek histogram
 - [ ] Add custom styling for cells just like in the old days
 - [ ] The sort indicators on the headers
 - [ ] Sorting nested headers, get the field name right
*/

export function ZedTable(props: {
  shape: zed.TypeRecord | zed.TypeArray
  values: zed.Value[]
  handlers: TableHandlers
}) {
  const api = useApi(props)

  return (
    <Provider value={api}>
      <div
        className={classNames("zed-table", {
          "zed-table--resizing": api.isResizing,
        })}
        ref={(node) => (api.element = node)}
      >
        <Grid />
      </div>
    </Provider>
  )
}
