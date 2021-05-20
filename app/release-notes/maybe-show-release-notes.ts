import {releaseNotesPath} from "app/router/utils/paths"
import isDev from "src/js/electron/isDev"
import Current from "src/js/state/Current"
import Launches from "src/js/state/Launches"
import Tabs from "src/js/state/Tabs"

const isItest = process.env.BRIM_ITEST === "true"

export function maybeShowReleaseNotes() {
  return (dispatch, getState) => {
    if (!isDev && !isItest && Launches.firstRunOfVersion(getState())) {
      dispatch(showReleaseNotes())
      dispatch(Launches.touchVersion())
    }
  }
}

export function showReleaseNotes() {
  return (dispatch, getState) => {
    const id = Current.getWorkspaceId(getState())
    dispatch(Tabs.new(releaseNotesPath(id)))
  }
}
