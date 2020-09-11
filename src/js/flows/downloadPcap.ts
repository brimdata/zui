import {Thunk} from "../state/types"
import Packets from "../state/Packets"
import open from "../lib/open"
import Log from "../models/Log"

export const downloadPcap = (currentLog: Log): Thunk => (dispatch) => {
  dispatch(Packets.fetch(currentLog)).then((pcapFile) =>
    open(pcapFile, {newWindow: true})
  )
}
