import * as zed from "@brimdata/zed-js"
import {createMenu} from "src/core/menu"
import ZuiApi from "src/js/api/zui-api"
import QueryInfo from "src/js/state/QueryInfo"

function getWhenContext(api: ZuiApi, value: zed.Any) {
  return {
    isPrimitive: zed.isPrimitive(value),
    isIterable: zed.isIterable(value),
    isGroupBy: api.select(QueryInfo.get).isSummarized,
    selectedText: document.getSelection().toString() || null,
    isIp: value instanceof zed.Ip,
  }
}

export const valueContextMenu = createMenu(
  ({api}, value: zed.Any, field: zed.Field | null, rootValue: zed.Value) => {
    const when = getWhenContext(api, value)

    return [
      {
        label: "Filter == Value",
        visible: when.isPrimitive,
        command: "editor.filterEqualsValue",
      },
      {
        label: "Filter != Value",
        visible: when.isPrimitive,
        command: "editor.filterNotEqualsValue",
      },
      {
        label: "Filter In Field",
        visible: when.isIterable,
        command: "editor.filterInField",
      },
      {
        label: "Filter Not In Field",
        visible: when.isIterable,
        command: "editor.filterNotInField",
      },
      {
        label: "New Search With Value",
        command: "editor.newSearchWithValue",
      },
      {type: "separator"},
      {
        label: "Pivot to Values",
        command: "editor.pivotToValues",
        enabled: when.isGroupBy,
      },
      {
        label: "Count By Field",
        command: "editor.countByField",
        enabled: !when.isGroupBy,
      },
      {type: "separator"},
      {
        label: "Copy",
        command: "editor.copyValueToClipboard",
      },
      {
        label: "Copy Full Value",
        command: "editor.copyValueToClipboard",
        visible: value !== rootValue,
      },
      {type: "separator"},
      {
        label: "Sort Asc",
        command: "editor.sortAsc",
      },
      {label: "Sort Desc", command: "editor.sortDesc"},
      {type: "separator"},
      {
        label: "Set Time Range From",
        command: "session.setTimeRangeFrom",
      },
      {
        label: "Set Time Range To",
        command: "session.setTimeRangeTo",
      },
      {type: "separator"},
      {
        label: "Show In Detail Pane",
        command: "session.showValueDetails",
      },
      {type: "separator"},
      {
        label: "Whois Lookup",
        command: "session.showWhoIs",
        enabled: when.isIp,
      },
      {
        label: "Virus Total",
        command: "session.openVirusTotal",
      },
    ]
  }
)
