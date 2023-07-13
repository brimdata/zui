import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import {LakeModel} from "src/js/models/lake"
import Lakes from "../../state/Lakes"
import LakeStatuses from "../../state/LakeStatuses"
import {LakeStatus} from "../../state/LakeStatuses/types"
import Window from "src/js/state/Window"

export const saveLake =
  (l: LakeModel, status: LakeStatus) =>
  (dispatch, _gs): void => {
    dispatch(Lakes.add(l.serialize()))
    dispatch(LakeStatuses.set(l.id, status))
    dispatch(Lakes.add(l.serialize()))
    dispatch(Window.setLakeId(l.id))
    dispatch(syncPoolsData())
  }
