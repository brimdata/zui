import {zed} from "@brimdata/zealot"
import {createMenu} from "src/core/menu"
import BrimApi from "src/js/api"
import * as editor from "../commands/editor"
import * as pins from "../commands/pins"
import * as values from "../commands/values"

function getWhenContext(api: BrimApi, value: zed.Any) {
  return {
    isPrimitive: zed.isPrimitive(value),
    isIterable: zed.isIterable(value),
    isGroupBy: api.current.query.toAst().isSummarized,
    selectedText: document.getSelection().toString() || null,
    isIp: value instanceof zed.Ip,
  }
}

export const valueContextMenu = createMenu(
  "valueContextMenu",
  (
    {api},
    value: zed.Any,
    field: zed.Field | zed.FieldData | null,
    rootValue: zed.Value
  ) => {
    const when = getWhenContext(api, value)

    return [
      {
        label: "Filter == Value",
        visible: when.isPrimitive,
        command: editor.filterEqualsValue.bind(field),
      },
      {
        label: "Filter != Value",
        visible: when.isPrimitive,
        command: editor.filterNotEqualsValue.bind(field),
      },
      {
        label: "Filter In Field",
        visible: when.isIterable,
        command: editor.filterInField.bind(field, value),
      },
      {
        label: "Filter Not In Field",
        visible: when.isIterable,
        command: editor.filterNotInField.bind(field, value),
      },
      {
        label: "New Search With Value",
        command: editor.newSearchWithValue.bind(field),
      },
      {type: "separator"},
      {
        label: "Pivot to Values",
        command: editor.pivotToValues.bind(field),
        enabled: when.isGroupBy,
      },
      {
        label: "Count By Field",
        command: editor.countByField.bind(field),
        enabled: !when.isGroupBy,
      },
      {type: "separator"},
      {
        label: "Copy",
        command: editor.copyValueToClipboard.bind(value),
      },
      {
        label: "Copy Full Value",
        command: editor.copyValueToClipboard.bind(value),
        visible: value !== rootValue,
      },
      {type: "separator"},
      {
        label: "Sort Asc",
        command: editor.sortAsc.bind(field.path),
      },
      {label: "Sort Desc", command: editor.sortDesc.bind(field.path)},
      {type: "separator"},
      {
        label: "Set Time Range From",
        command: pins.setTimeRangeFrom.bind(value),
      },
      {
        label: "Set Time Range To",
        command: pins.setTimeRangeTo.bind(value),
      },
      {type: "separator"},
      {
        label: "Show In Detail Pane",
        command: values.showValueDetails.bind(field.rootRecord),
      },
      {type: "separator"},
      {
        label: "Whois Lookup",
        command: values.showWhoIs.bind(value),
        enabled: when.isIp,
      },
      {
        label: "Virus Total",
        command: values.openVirusTotal.bind(value),
      },
    ]
  }
)
