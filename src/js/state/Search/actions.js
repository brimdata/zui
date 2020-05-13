/* @flow */
import type {DateTuple} from "../../lib/TimeWindow"
import type {
  SEARCH_CLEAR,
  SEARCH_CLUSTER_SET,
  SEARCH_SPACE_SET,
  SEARCH_SPAN_ARGS_SET,
  SEARCH_SPAN_FOCUS_SET,
  SEARCH_SPAN_SET,
  SpanArgs
} from "./types"
import brim, {type Span} from "../../brim"

export default {
  setSpace(
    spaceId: string,
    spaceName: string,
    tabId?: string
  ): SEARCH_SPACE_SET {
    return {type: "SEARCH_SPACE_SET", spaceId, spaceName, tabId}
  },
  setSpan(span: Span): SEARCH_SPAN_SET {
    return {type: "SEARCH_SPAN_SET", span}
  },
  setSpanArgs(spanArgs: SpanArgs, tabId?: string): SEARCH_SPAN_ARGS_SET {
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs, tabId}
  },
  setSpanArgsFromDates(dates: DateTuple): SEARCH_SPAN_ARGS_SET {
    let spanArgs = brim.dateTuple(dates).toSpan()
    return {type: "SEARCH_SPAN_ARGS_SET", spanArgs}
  },
  setSpanFocus(spanFocus: ?Span): SEARCH_SPAN_FOCUS_SET {
    return {type: "SEARCH_SPAN_FOCUS_SET", spanFocus}
  },
  setCluster(clusterId: string): SEARCH_CLUSTER_SET {
    return {type: "SEARCH_CLUSTER_SET", clusterId}
  },
  clear(): SEARCH_CLEAR {
    return {type: "SEARCH_CLEAR"}
  }
}
