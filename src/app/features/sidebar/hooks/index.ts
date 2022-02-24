import useResizeObserver from "use-resize-observer"
import {useDrop} from "react-dnd"
import {NativeTypes} from "react-dnd-html5-backend"
import {DragItem, DragProps} from "src/app/features/import/use-import-on-drop"
import {useBrimApi} from "src/app/core/context"
import {useMemo} from "react"
import {useDispatch, useSelector} from "react-redux"
import brim from "src/js/brim"
import Investigation from "src/js/state/Investigation"
import {AppDispatch} from "src/js/state/types"
import Current from "src/js/state/Current"
import {isRemoteLib, setRemoteQueries} from "../flows/remote-queries"
import {isBrimLib} from "src/js/state/Queries/flows"
import SearchBar from "src/js/state/SearchBar"
import {submitSearch} from "src/js/flows/submitSearch/mod"
import lib from "src/js/lib"
import toast from "react-hot-toast"
import {ipcRenderer, MenuItemConstructorOptions} from "electron"
import exportQueryLib from "src/js/flows/exportQueryLib"
import Modal from "src/js/state/Modal"
import * as remote from "@electron/remote"
import {Query} from "src/js/state/Queries/types"
import Queries from "src/js/state/Queries"

export const useSectionTreeDefaults = () => {
  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>()
  return {
    resizeRef: ref,
    defaults: {
      indent: 8,
      getChildren: "items",
      isOpen: "isOpen",
      rowHeight: 28,
      width: width,
      height: height,
      hideRoot: true,
      disableDrag: true,
      disableDrop: true,
      openByDefault: true
    }
  }
}

export const useQueryImportOnDrop = () => {
  const api = useBrimApi()
  return useDrop<DragItem, unknown, DragProps>(() => ({
    accept: [NativeTypes.FILE],
    drop: ({files}) => {
      if (files && files[0]) {
        api.importQueries(files[0])
      }
    },
    collect: (m) => ({
      isOver: m.isOver(),
      canDrop: m.canDrop()
    })
  }))
}

export const useSearchHistory = () => {
  const historyEntries = useSelector(Investigation.getCurrentHistory)

  return useMemo(() => {
    return [...historyEntries].sort((a, b) =>
      brim.time(a.ts).toDate() < brim.time(b.ts).toDate() ? 1 : -1
    )
  }, [historyEntries])
}

export const useQueryItemMenu = (data, tree, handlers) => {
  const dispatch = useDispatch<AppDispatch>()
  const currentPool = useSelector(Current.getPool)
  const api = useBrimApi()
  const {value, id} = data
  const isGroup = "items" in data
  const selected = Array.from(new Set([...tree.getSelectedIds(), data.id]))
  const hasMultiSelected = selected.length > 1

  const isRemoteItem = dispatch(isRemoteLib([id]))
  const isBrimItem = dispatch(isBrimLib([id]))
  const hasBrimItemSelected = dispatch(isBrimLib(selected))

  const runQuery = (value) => {
    dispatch(SearchBar.clearSearchBar())
    dispatch(SearchBar.changeSearchBarInput(value))
    dispatch(submitSearch())
  }

  return [
    {
      label: "Run Query",
      enabled: !hasMultiSelected && !!currentPool,
      visible: !isGroup,
      click: () => runQuery(value)
    },
    {
      label: "Copy Query",
      enabled: !hasMultiSelected,
      visible: !isGroup,
      click: () => {
        lib.doc.copyToClipboard(value)
        toast("Query copied to clipboard")
      }
    },
    {
      label: "Export Folder as JSON",
      visible: isGroup && !hasMultiSelected,
      click: async () => {
        const {canceled, filePath} = await ipcRenderer.invoke(
          "windows:showSaveDialog",
          {
            title: `Save Queries Folder as JSON`,
            buttonLabel: "Export",
            defaultPath: `${data.name}.json`,
            properties: ["createDirectory"],
            showsTagField: false
          }
        )
        if (canceled) return
        toast.promise(
          dispatch(exportQueryLib(filePath, api.exportQueries(id))),
          {
            loading: "Exporting Queries...",
            success: "Export Complete",
            error: "Error Exporting Queries"
          }
        )
      }
    },
    {type: "separator"},
    {
      label: "Rename",
      enabled: !isBrimItem,
      click: () => handlers.edit()
    },
    {
      label: "Edit",
      enabled: !hasMultiSelected && !isBrimItem,
      visible: !isGroup,
      click: () => {
        const modalArgs = {query: data, isRemote: false}
        if (isRemoteItem) modalArgs.isRemote = true
        dispatch(Modal.show("edit-query", modalArgs))
      }
    },
    {type: "separator"},
    {
      label: hasMultiSelected ? "Delete Selected" : "Delete",
      enabled: !hasBrimItemSelected,
      click: () => {
        const selected = Array.from(
          new Set([...tree.getSelectedIds(), data.id])
        )
        return remote.dialog
          .showMessageBox({
            type: "warning",
            title: "Confirm Delete Query Window",
            message: `Are you sure you want to delete the ${
              selected.length > 1 ? selected.length : ""
            } selected item${selected.length > 1 ? "s" : ""}?`,
            buttons: ["OK", "Cancel"]
          })
          .then(({response}) => {
            if (response === 0) {
              if (isRemoteItem) {
                const remoteQueries = selected.map<Query>((id) => ({
                  id,
                  value: "",
                  name: "",
                  pins: {from: "", filters: []}
                }))
                dispatch(setRemoteQueries(remoteQueries, true))
                return
              }

              dispatch(Queries.removeItems(selected))
            }
          })
      }
    }
  ] as MenuItemConstructorOptions[]
}
