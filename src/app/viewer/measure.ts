import {FormatConfig, formatValue} from "src/app/core/format"
import {isEventType} from "src/ppl/suricata/suricata-plugin"
import {isPath} from "src/ppl/zeek/zeek-plugin"
import {zed} from "@brimdata/zealot"

const ONE_CHAR = 7.39
const CELL_PAD = ONE_CHAR * 2

const MAX_WIDTH = 500
const MIN_WIDTH = 10
const resizeHandle = 5
const sortIcon = 11
const PADDING = 4

export function estimateHeaderWidth(name: string) {
  let width = Math.ceil(
    name.length * ONE_CHAR + resizeHandle + sortIcon + PADDING
  )
  return Math.min(MAX_WIDTH, width)
}

export function estimateCellWidth(
  value: zed.Value,
  name: string,
  config: Partial<FormatConfig>
) {
  let width = MIN_WIDTH
  if (value instanceof zed.Primitive) {
    width = Math.ceil(
      formatValue(value, config).length * ONE_CHAR + CELL_PAD + 12
    )
  } else {
    width = Math.ceil(value.toString().length * ONE_CHAR + CELL_PAD)
  }

  // Move to plugin
  if (isPath(name, value)) {
    width += 12 // padding
  }

  // Move to plugin
  if (isEventType(name, value)) {
    width += 12 // padding
  }

  return Math.min(MAX_WIDTH, width)
}
