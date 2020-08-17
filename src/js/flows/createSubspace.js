/* @flow */
import type {Thunk} from "../state/types"
import {getUniqName} from "../lib/uniqName"
import Spaces from "../state/Spaces"
import Tab from "../state/Tab"
import Tabs from "../state/Tabs"
import Viewer from "../state/Viewer"
import brim from "../brim"
import refreshSpaceNames from "./refreshSpaceNames"

class CreateSubspaceError extends Error {}

export default (): Thunk => (dispatch, getState, {zealot}) => {
  const spaceId = Tab.getSpaceId(getState())
  const clusterId = Tab.clusterId(getState())
  const names = Spaces.getSpaces(clusterId)(getState()).map((s) => s.name)
  const records = Viewer.getSelectedRecords(getState()).map(brim.record)
  if (!records.length)
    return Promise.reject(new CreateSubspaceError("No selected logs"))

  try {
    const logs = records.map((r) => r.mustGet("_log").stringValue())
    const keys = records.map((r) => r.mustGet("key").stringValue())
    const name = getUniqName(keys[0], names)
    return zealot.subspaces
      .create({name, spaceId, logs})
      .then((space) =>
        dispatch(refreshSpaceNames()).then(() => dispatch(Tabs.new(space.id)))
      )
  } catch (e) {
    return Promise.reject(new CreateSubspaceError(e.message))
  }
}
