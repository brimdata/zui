/* @flow */
import type {IpcMsg} from "./types"

export default function sendTo(webContents: *, message: IpcMsg) {
  webContents.send(message.channel, message)
}
