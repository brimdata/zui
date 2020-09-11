import action from "./action"
import Modal from "../../../state/Modal/actions"
import {remote} from "electron"
import deleteSpace from "../../../flows/deleteSpace"

function buildSpaceActions() {
  return {
    rename: action({
      name: "space-rename",
      label: "Rename",
      listener(dispatch, clusterId, spaceId) {
        dispatch(Modal.show("space", {clusterId, spaceId}))
      }
    }),
    delete: action({
      name: "space-delete",
      label: "Delete",
      listener(dispatch, spaceId, spaceName) {
        remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Delete Space",
            message: `Are you sure you want to delete ${spaceName}?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) dispatch(deleteSpace(spaceId))
          })
      }
    })
  }
}

export default buildSpaceActions()
