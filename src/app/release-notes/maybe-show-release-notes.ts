import env from "src/app/core/env"
import {releaseNotesPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Launches from "src/js/state/Launches"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export function maybeShowReleaseNotes(): Thunk {
  return async (dispatch, getState) => {
    const version = global.appMeta.version
    const isFirstRunEver = global.appMeta.isFirstRun

    if (
      !env.isIntegrationTest &&
      !isFirstRunEver &&
      global.mainArgs.releaseNotes &&
      Launches.firstRunOfVersion(getState(), version)
    ) {
      dispatch(showReleaseNotes())
      dispatch(Launches.touchVersion(version))
    }
  }
}

export function showReleaseNotes() {
  return (dispatch, getState) => {
    const id = Current.getLakeId(getState())
    dispatch(Tabs.create(releaseNotesPath(id)))
  }
}
