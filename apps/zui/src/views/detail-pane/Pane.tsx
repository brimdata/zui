import React, {useLayoutEffect, useRef} from "react"
import {useSelector} from "react-redux"
import LogDetails from "src/js/state/LogDetails"
import Fields from "./Fields"
import NoSelection from "./NoSelection"
import * as zed from "@brimdata/zed-js"
import {ListView} from "src/zui-kit"

export default function Pane() {
  const record = useSelector(LogDetails.build)
  const ref = useRef<HTMLDivElement>()

  useLayoutEffect(() => {
    const node = ref.current
    if (node) node.scrollTop = 0
  }, [record])

  return (
    <div ref={ref} className="gutter region">
      {record && record instanceof zed.Record ? (
        <ListView values={[record]} />
      ) : (
        <NoSelection />
      )}
    </div>
  )
}
