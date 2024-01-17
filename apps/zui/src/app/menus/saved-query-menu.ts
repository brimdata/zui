import * as queries from "src/app/commands/queries"
import {ActiveQuery} from "../core/models/active-query"
import {createMenu} from "src/core/menu"
import {openQueryMenu} from "./open-query-menu"

export const savedQueryMenu = createMenu((_, active: ActiveQuery) => {
  const query = active.query
  return [
    {
      label: "Go to Latest Version",
      click: () => queries.openLatestVersion.run(),
      visible: active.isOutdated(),
    },
    {label: "Switch Query", nestedMenu: openQueryMenu()},
    {type: "separator"},
    {
      label: "Duplicate",
      click: () => queries.duplicate.run(),
      enabled: !query.isReadOnly,
    },
    {
      label: "Move To Remote",
      click: () => queries.moveToSource.run("remote"),
      enabled: !query.isReadOnly,
      visible: query.isLocal,
    },
    {
      label: "Move To Local",
      click: () => queries.moveToSource.run("local"),
      enabled: !query.isReadOnly,
      visible: query.isRemote,
    },
    {
      label: "Copy To Remote",
      click: () => queries.copyToSource.run("remote"),
      enabled: !query.isReadOnly,
      visible: query.isLocal,
    },
    {
      label: "Copy To Local",
      click: () => queries.copyToSource.run("local"),
      enabled: !query.isReadOnly,
      visible: query.isRemote,
    },
    {
      label: "Lock Query",
      click: () => queries.lock.run(),
      visible: !query.isReadOnly,
    },

    {type: "separator"},
    {
      label: "Unlock Query",
      click: () => queries.unlock.run(),
      visible: query.isReadOnly,
    },
    {
      label: "Rename...",
      click: () => queries.rename.run(),
      enabled: !query.isReadOnly,
    },
    {
      label: "Delete",
      click: () => queries.deleteCmd.run(),
      enabled: !query.isReadOnly,
    },
  ]
})
