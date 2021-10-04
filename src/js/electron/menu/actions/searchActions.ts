import lib from "src/js/lib"
import {toZql} from "src/js/zql/toZql"
import {ZealotContext, zed, zjson} from "zealot"
import brim from "../../../brim"
import scrollToLog from "../../../flows/scrollToLog"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../../flows/searchBar/actions"
import {submitSearch} from "../../../flows/submitSearch/mod"
import {viewLogDetail} from "../../../flows/viewLogDetail"
import open from "../../../lib/open"
import ErrorFactory from "../../../models/ErrorFactory"
import virusTotal from "../../../services/virusTotal"
import Layout from "../../../state/Layout/actions"
import Modal from "../../../state/Modal"
import Notice from "../../../state/Notice"
import SearchBar from "../../../state/SearchBar"
import tab from "../../../state/Tab"
import action from "./action"

function buildSearchActions() {
  return {
    copy: action({
      name: "search-cell-menu-copy",
      label: "Copy",
      listener(_dispatch, data: zjson.EncodedField) {
        const f = ZealotContext.decodeField(data)
        lib.doc.copyToClipboard(f.data.toString())
      }
    }),
    countBy: action({
      name: "search-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, data: zjson.EncodedField) {
        const f = ZealotContext.decodeField(data)
        dispatch(appendQueryCountBy(f))
        dispatch(submitSearch())
      }
    }),
    detail: action({
      name: "search-cell-menu-detail",
      label: "Open details",
      listener(dispatch, data: zjson.RootRecord) {
        const record = ZealotContext.decodeRecord(data)
        dispatch(Layout.showRightSidebar())
        dispatch(viewLogDetail(record))
      }
    }),
    exclude: action({
      name: "search-cell-menu-exclude",
      label: "Filter != value",
      listener(dispatch, data: zjson.EncodedField) {
        dispatch(appendQueryExclude(ZealotContext.decodeField(data)))
        dispatch(submitSearch())
      }
    }),
    freshInclude: action({
      name: "search-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(toZql(field.data)))
        dispatch(submitSearch())
      }
    }),
    fromTime: action({
      name: "search-cell-menu-from-time",
      label: 'Use as "start" time',
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        if (field.data instanceof zed.Time) {
          dispatch(tab.setFrom(brim.time(field.data.toDate()).toTs()))
          dispatch(submitSearch())
        }
      }
    }),
    groupByDrillDown: action({
      name: "search-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program: string, data: zjson.RootRecord) {
        const record = ZealotContext.decodeRecord(data)
        const newProgram = brim
          .program(program)
          .drillDown(record)
          .string()

        if (newProgram) {
          dispatch(SearchBar.clearSearchBar())
          dispatch(SearchBar.changeSearchBarInput(newProgram))
          dispatch(submitSearch())
        }
      }
    }),
    include: action({
      name: "search-cell-menu-include",
      label: "Filter == value",
      listener(dispatch, data: zjson.EncodedField) {
        dispatch(appendQueryInclude(ZealotContext.decodeField(data)))
        dispatch(submitSearch())
      }
    }),
    in: action({
      name: "search-cell-menu-in",
      label: "Filter in field",
      listener(dispatch, data: zjson.EncodedField, index: number) {
        const field = ZealotContext.decodeField(data)
        if (zed.isIterable(field.value)) {
          const item = field.value.at(index)
          if (item) {
            dispatch(appendQueryIn(field, item))
            dispatch(submitSearch())
          }
        }
      }
    }),
    jumpToTime: action({
      name: "search-cell-menu-show-context",
      label: "View in full context",
      listener(
        dispatch,
        fieldData: zjson.EncodedField,
        recordData: zjson.RootRecord
      ) {
        const field = ZealotContext.decodeField(fieldData)
        const record = ZealotContext.decodeRecord(recordData)
        if (field.data instanceof zed.Time) {
          const brimTime = brim.time(field.data.toDate())
          dispatch(tab.setFrom(brimTime.subtract(1, "minutes").toTs()))
          dispatch(tab.setTo(brimTime.add(1, "minutes").toTs()))
          dispatch(SearchBar.clearSearchBar())
          dispatch(submitSearch())
            .then(() => {
              dispatch(scrollToLog(record))
            })
            .catch((error) => {
              console.error(error)
              dispatch(Notice.set(ErrorFactory.create(error)))
            })
        }
      }
    }),
    notIn: action({
      name: "search-cell-menu-not-in",
      label: "Filter not in field",
      listener(dispatch, data: zjson.EncodedField, index: number) {
        const field = ZealotContext.decodeField(data)
        if (zed.isIterable(field.value)) {
          const item = field.value.at(index)
          if (item) {
            dispatch(appendQueryNotIn(field, item))
            dispatch(submitSearch())
          }
        }
      }
    }),
    logResult: action({
      name: "search-cell-menu-log-result",
      label: "Log result to console",
      listener(_dispatch, field: zjson.EncodedField, log: zjson.RootRecord) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    sortAsc: action({
      name: "search-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(submitSearch())
      }
    }),
    sortDesc: action({
      name: "search-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(submitSearch())
      }
    }),
    toTime: action({
      name: "search-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        if (field.data instanceof zed.Time) {
          dispatch(
            tab.setTo(
              brim
                .time(field.data.toDate())
                .add(1, "ms")
                .toTs()
            )
          )
          dispatch(submitSearch())
        }
      }
    }),
    virusTotalRightclick: action({
      name: "search-cell-menu-virus-total",
      label: "VirusTotal Lookup",
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        if (field.data instanceof zed.Primitive && !field.data.isUnset()) {
          open(virusTotal.url(field.data.toString() as string))
        }
      }
    }),
    whoisRightclick: action({
      name: "search-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, data: zjson.EncodedField) {
        const field = ZealotContext.decodeField(data)
        dispatch(Modal.show("whois", {addr: field.data.toString()}))
      }
    })
  }
}

export default buildSearchActions()
