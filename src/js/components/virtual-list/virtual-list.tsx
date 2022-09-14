import React from "react"
import {FixedSizeList} from "react-window"
import {ListContext} from "./context"
import {FillFlex} from "./fill-flex"
import {InnerElement} from "./inner-element"
import {ListProps} from "./types"
import {VirtualRow} from "./virtual-row"

export function VirtualList<Item>(props: ListProps<Item>) {
  return (
    <ListContext.Provider value={props}>
      <FillFlex>
        {(dimens) => (
          <FixedSizeList
            height={dimens.height}
            width={dimens.width}
            itemData={props.items}
            itemCount={props.items.length}
            itemSize={props.rowHeight ?? 22}
            innerElementType={InnerElement}
          >
            {VirtualRow}
          </FixedSizeList>
        )}
      </FillFlex>
    </ListContext.Provider>
  )
}
