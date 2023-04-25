import {selectQuery} from "src/app/events/select-query-event"
import {invoke} from "src/core/invoke"
import Appearance from "src/js/state/Appearance"
import {Thunk} from "src/js/state/types"

export const queriesImport =
  (file: File): Thunk =>
  async (dispatch, __, {api}) => {
    const resp = await invoke("importQueries", file.path)

    if ("error" in resp) {
      api.toast.error(resp.error)
    } else {
      const {id, size} = resp
      if (size) {
        api.toast.success(`Imported ${resp.size} queries`)
      }
      if (id) {
        dispatch(Appearance.setCurrentSectionName("queries"))
        dispatch(Appearance.setQueriesView("local"))
        setTimeout(() => {
          selectQuery.trigger(resp.id)
        })
      }
    }
  }
