import {zed} from "packages/zealot/src"
import {ZedContext} from "packages/zealot/src/zed/context"
import {appendQueryInclude} from "src/js/flows/searchBar/actions"
import {showContextMenu} from "src/js/lib/System"

export const showResultsContextMenu =
  (args: {value: zed.Value; field: zed.Field; record: zed.Record}) =>
  (dispatch, getState) => {
    showContextMenu([
      {
        label: "Filter == value",
        click: () => {
          // search
          dispatch(appendQueryInclude(field))
          // detail
          dispatch(SearchBar.clearSearchBar())
          dispatch(appendQueryInclude(decode(field)))
          dispatch(openNewSearchTab())
        },
      },
    ])
  }
