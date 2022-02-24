import env from "src/app/core/env"
import {metaClient} from "src/app/ipc/meta"
import {releaseNotesPath} from "src/app/router/utils/paths"
import Current from "src/js/state/Current"
import Launches from "src/js/state/Launches"
import Tabs from "src/js/state/Tabs"

export function maybeShowReleaseNotes() {
  return async (dispatch, getState) => {
    const version = await metaClient.version()
    if (
      !env.isIntegrationTest &&
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
    dispatch(Tabs.new(releaseNotesPath(id)))
  }
}
