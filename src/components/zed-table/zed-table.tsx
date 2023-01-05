import React, {forwardRef, useImperativeHandle} from "react"
import {Provider} from "./context"
import {Grid} from "./grid"
import classNames from "classnames"
import {ZedTableProps} from "./types"
import {createZedTable} from "./create-zed-table"

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
 - [x] Sorting nested headers, get the field name right
 - [ ] Show non-record types
 - [ ] Toolbar button to expand all headers and collapse all headers 
 - [ ] Resize header performance on many columns
 - [ ] Style the header properly during the autosize, right now headers are cut off
 - [ ] Performance on Giant Tables
 - [x] When new results come in, it doesn't render
*/

export const ZedTable = forwardRef(function ZedTable(
  props: ZedTableProps,
  ref
) {
  const api = createZedTable(props)
  useImperativeHandle(ref, () => api, [api])

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
})
