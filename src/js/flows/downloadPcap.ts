import {zed} from "zealot"
import open from "../lib/open"
import Packets from "../state/Packets"
import {Thunk} from "../state/types"

export const downloadPcap = (currentLog: zed.Record): Thunk => (dispatch) => {
  dispatch(Packets.fetch(currentLog)).then((pcapFile) =>
    open(pcapFile, {newWindow: true})
  )
}
