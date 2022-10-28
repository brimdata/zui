import * as queries from "src/app/commands/queries"
import {ActiveQuery} from "../core/models/active-query"
import {createMenu} from "./create-menu"
import {openQueryMenu} from "./open-query-menu"

export const savedQueryMenu = createMenu(
  "savedQueryMenu",
  (_, active: ActiveQuery) => {
    const query = active.query
    return [
      {
        label: "Go to Latest Version",
        command: queries.openLatestVersion,
        visible: active.isOutdated(),
      },
      {label: "Switch Query", nestedMenu: openQueryMenu},
      {type: "separator"},
      {
        label: "Duplicate",
        command: queries.duplicate,
        enabled: !query.isReadOnly,
      },
      {
        label: "Move To Remote",
        command: queries.moveToSource.bind("remote"),
        enabled: !query.isReadOnly,
        visible: query.isLocal,
      },
      {
        label: "Move To Local",
        command: queries.moveToSource.bind("local"),
        enabled: !query.isReadOnly,
        visible: query.isRemote,
      },
      {
        label: "Copy To Remote",
        command: queries.copyToSource.bind("remote"),
        enabled: !query.isReadOnly,
        visible: query.isLocal,
      },
      {
        label: "Copy To Local",
        command: queries.copyToSource.bind("local"),
        enabled: !query.isReadOnly,
        visible: query.isRemote,
      },
      {
        label: "Lock Query",
        command: queries.lock,
        visible: !query.isReadOnly,
      },

      {type: "separator"},
      {
        label: "Unlock Query",
        command: queries.unlock,
        visible: query.isReadOnly,
      },
      {
        label: "Rename...",
        command: queries.rename,
        enabled: !query.isReadOnly,
      },
      {
        label: "Delete",
        command: queries.deleteCmd,
        enabled: !query.isReadOnly,
      },
    ]
  }
)
