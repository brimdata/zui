/* @flow */

import type {ClientOptions} from "./types"
import Base from "./client/Base"
import Descriptors from "./client/Descriptors"
import Packets from "./client/Packets"
import Spaces from "./client/Spaces"
import Tasks from "./client/Tasks"

export {default as LookyTalk} from "lookytalk"
export {default as Handler} from "./lib/Handler"

export default class BoomClient extends Base {
  spaces: *
  descriptors: *
  tasks: *
  packets: *

  constructor(options: ClientOptions = {}) {
    super(options)
    this.spaces = new Spaces(this)
    this.descriptors = new Descriptors(this)
    this.tasks = new Tasks(this)
    this.packets = new Packets(this)
  }
}
