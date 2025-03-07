import {syncPoolsData} from "src/models/sync-pools-data"
import Lakes from "../../state/Lakes"
import LakeStatuses from "../../state/LakeStatuses"
import {LakeStatus} from "../../state/LakeStatuses/types"
import Window from "src/js/state/Window"
import {LakeAttrs} from "src/js/state/Lakes/types"
import {Lake} from "src/models/lake"

export const saveLake =
  (attrs: LakeAttrs, status: LakeStatus) =>
  (dispatch): void => {
    const {id} = attrs
    const lake = Lake.find(id)
    if (lake) {
      lake.update(attrs)
    } else {
      dispatch(Lakes.add(attrs))
    }
    dispatch(LakeStatuses.set(attrs.id, status))
    dispatch(Window.setLakeId(attrs.id))
    dispatch(syncPoolsData())
  }
