import {Thunk} from "../state/types"

export const openNewSearchTab = (): Thunk => {
  return () => {}
  // return (dispatch, getState) => {
  //   const state = getState()
  //   const lakeId = Current.getLakeId(state)
  //   const pool = Current.getQueryPool(state)
  //   const {current} = SearchBar.getSearchBar(state)
  //   const query = dispatch(
  //     Queries.create({value: current, pins: [{type: "from", value: pool.id}]})
  //   )
  // invoke(
  //   ipc.windows.newSearchTab({
  //     href: lakeQueryPath(query.id, lakeId, query.latestVersionId()),
  //   })
  // )
  // }
}
