/* @flow */
import action from "./action"
import Modal from "../../../state/Modal/actions"

function buildSpaceActions() {
  return {
    rename: action({
      name: "space-rename",
      label: "Rename",
      listener(dispatch, clusterId, spaceId) {
        dispatch(Modal.show("space", {clusterId, spaceId}))
      }
    })
  }
}

export default buildSpaceActions()
