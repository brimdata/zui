import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import errors from "src/js/errors"
import ErrorFactory from "src/js/models/ErrorFactory"
import Notice from "src/js/state/Notice"
import {Thunk} from "src/js/state/types"
import loadFiles from "./load-files"

export const load =
  (files: File[]): Thunk<Promise<void>> =>
  (dispatch, getState, {api}) => {
    return dispatch(loadFiles(files))
      .then(() => {
        api.toast.success("Import complete.")
      })
      .catch((e) => {
        const cause = e.cause
        if (/(Failed to fetch)|(network error)/.test(cause.message)) {
          dispatch(Notice.set(errors.importInterrupt()))
        } else if (/format detection error/i.test(cause.message)) {
          dispatch(Notice.set(errors.formatDetection(cause.message)))
        } else {
          dispatch(Notice.set(ErrorFactory.create(e.cause)))
        }
        dispatch(syncPoolsData()).catch((e) => e)
        console.error(e.message)
      })
  }
