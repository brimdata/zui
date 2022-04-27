import {syncPoolsData} from "src/app/core/pools/sync-pools-data"
import tabHistory from "src/app/router/tab-history"
import {BrimLake} from "../../brim"
import Lakes from "../../state/Lakes"
import LakeStatuses from "../../state/LakeStatuses"
import {LakeStatus} from "../../state/LakeStatuses/types"

export const saveLake =
  (l: BrimLake, status: LakeStatus) =>
  (dispatch, _gs): void => {
    dispatch(Lakes.add(l.serialize()))
    dispatch(LakeStatuses.set(l.id, status))
    dispatch(Lakes.add(l.serialize()))
    dispatch(tabHistory.push(`/lakes/${l.id}`))
    dispatch(syncPoolsData())
  }
