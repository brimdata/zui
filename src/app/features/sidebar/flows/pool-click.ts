import {Pool} from "src/app/core/pools/pool"
import {lakeQueryPath} from "src/app/router/utils/paths"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import Current from "src/js/state/Current"
import Editor from "src/js/state/Editor"
import Queries from "src/js/state/Queries"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export function poolClick(pool: Pool): Thunk {
  return (dispatch, getState) => {
    const query = Current.getQuery(getState())
    const lakeId = Current.getLakeId(getState())
    if (query) {
      dispatch(Editor.setFrom(pool.name))
      dispatch(submitSearch())
    } else {
      const query = dispatch(
        Queries.create({pins: [{type: "from", value: pool.name}]})
      )
      dispatch(Tabs.previewUrl(lakeQueryPath(query.id, lakeId)))
    }
  }
}
