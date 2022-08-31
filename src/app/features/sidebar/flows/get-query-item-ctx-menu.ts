import {
  deleteRemoteQueries,
  isRemoteLib,
} from "src/js/state/RemoteQueries/flows/remote-queries"
import lib from "src/js/lib"
import toast from "react-hot-toast"
import {ipcRenderer, MenuItemConstructorOptions} from "electron"
import exportQueryLib from "src/js/flows/exportQueryLib"
import * as remote from "@electron/remote"
import Queries from "src/js/state/Queries"
import QueryVersions from "src/js/state/QueryVersions"

const getQueryItemCtxMenu =
  ({data, tree, handlers}) =>
  (dispatch, getState, {api}) => {
    const {id, isReadOnly} = data
    const isGroup = "items" in data
    const hasMultiSelected =
      tree.getSelectedIds().length > 1 &&
      !!tree.getSelectedIds().find((id) => id === data.id)
    const isRemoteItem = dispatch(isRemoteLib([id]))
    const query = Queries.build(getState(), id)

    const handleDelete = () => {
      const selected = Array.from(new Set([...tree.getSelectedIds(), data.id]))
      return remote.dialog
        .showMessageBox({
          type: "warning",
          title: "Confirm Delete Query Window",
          message: `Are you sure you want to delete the ${
            hasMultiSelected ? selected.length : ""
          } selected item${hasMultiSelected ? "s" : ""}?`,
          buttons: ["OK", "Cancel"],
        })
        .then(({response}) => {
          if (response === 0) {
            selected.forEach((id) => dispatch(QueryVersions.at(id).deleteAll()))
            if (isRemoteItem) dispatch(deleteRemoteQueries(selected))
            else dispatch(Queries.removeItems(selected))
          }
        })
    }

    if (hasMultiSelected)
      return [
        {
          label: "Delete Selected",
          click: handleDelete,
        },
      ]

    return [
      {
        label: "Run Query",
        visible: !isGroup,
        click: () => api.queries.open(id),
      },
      {
        label: "Copy Query Value",
        visible: !isGroup,
        click: () => {
          lib.doc.copyToClipboard(query?.latestVersion()?.value)
          toast("Query value copied to clipboard")
        },
      },
      {
        label: "Export Folder as JSON",
        visible: isGroup,
        click: async () => {
          const {canceled, filePath} = await ipcRenderer.invoke(
            "windows:showSaveDialog",
            {
              title: `Save Queries Folder as JSON`,
              buttonLabel: "Export",
              defaultPath: `${data.name}.json`,
              properties: ["createDirectory"],
              showsTagField: false,
            }
          )
          if (canceled) return
          toast.promise(
            dispatch(exportQueryLib(filePath, api.exportQueries(id))),
            {
              loading: "Exporting Queries...",
              success: "Export Complete",
              error: "Error Exporting Queries",
            }
          )
        },
      },
      {type: "separator"},
      {
        label: "Rename",
        enabled: !isReadOnly,
        click: () => handlers.edit(),
      },
      {type: "separator"},
      {
        label: "Delete",
        click: handleDelete,
      },
    ] as MenuItemConstructorOptions[]
  }

export default getQueryItemCtxMenu
