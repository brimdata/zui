import {releaseNotesPath} from "src/app/router/utils/paths"
import Launches from "src/js/state/Launches"
import Tabs from "src/js/state/Tabs"
import {Thunk} from "src/js/state/types"

export function maybeShowReleaseNotes(): Thunk {
  return async (dispatch, getState) => {
    const version = global.appMeta.version
    const isFirstRunEver = global.appMeta.isFirstRun

    if (
      !global.env.isTest &&
      !isFirstRunEver &&
      global.mainArgs.releaseNotes &&
      Launches.firstRunOfVersion(getState(), version)
    ) {
      dispatch(Tabs.create(releaseNotesPath()))
      dispatch(Launches.touchVersion(version))
    }
  }
}
