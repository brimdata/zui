import {SuricataEvent} from "./models/SuricataEvent"
import React from "react"
import {ZeekEvent} from "./models/ZeekEvent"
import SuricataTag from "./SuricataTag"
import ZeekTag from "./ZeekTag"

export default function EventTag({event, ...rest}) {
  if (event instanceof ZeekEvent) return <ZeekTag event={event} {...rest} />
  if (event instanceof SuricataEvent)
    return <SuricataTag event={event} {...rest} />
  return null
}
