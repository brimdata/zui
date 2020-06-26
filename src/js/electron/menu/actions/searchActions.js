/* @flow */

import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../../flows/searchBar/actions"
import open from "../../../lib/open"
import {viewLogDetail} from "../../../flows/viewLogDetail"
import Log from "../../../models/Log"
import Modal from "../../../state/Modal"
import SearchBar from "../../../state/SearchBar"
import action from "./action"
import brim from "../../../brim"
import submitSearch from "../../../flows/submitSearch"
import tab from "../../../state/Tab"
import virusTotal from "../../../services/virusTotal"
import {downloadPcap} from "../../../flows/downloadPcap"
import Layout from "../../../state/Layout/actions"
import scrollToLog from "../../../flows/scrollToLog"

function buildSearchActions() {
  return {
    countBy: action({
      name: "search-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, field) {
        dispatch(appendQueryCountBy(field))
        dispatch(submitSearch())
      }
    }),
    detail: action({
      name: "search-cell-menu-detail",
      label: "Open details",
      listener(dispatch, log) {
        dispatch(Layout.showRightSidebar())
        log = new Log(log.tuple, log.descriptor)
        dispatch(viewLogDetail(log))
      }
    }),
    exclude: action({
      name: "search-cell-menu-exclude",
      label: "Filter != value",
      listener(dispatch, field) {
        dispatch(appendQueryExclude(field))
        dispatch(submitSearch())
      }
    }),
    freshInclude: action({
      name: "search-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, field) {
        field = brim.field(field)
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(field.queryableValue()))
        dispatch(submitSearch())
      }
    }),
    fromTime: action({
      name: "search-cell-menu-from-time",
      label: 'Use as "start" time',
      listener(dispatch, fieldData) {
        let field = brim.field(fieldData)
        if (field.type === "time") {
          dispatch(tab.setFrom(brim.time(field.toDate()).toTs()))
          dispatch(submitSearch())
        }
      }
    }),
    groupByDrillDown: action({
      name: "search-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program, log) {
        let newProgram = brim
          .program(program)
          .drillDown(brim.log(log.tuple, log.descriptor))
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
      label: "Filter = value",
      listener(dispatch, field) {
        dispatch(appendQueryInclude(field))
        dispatch(submitSearch())
      }
    }),
    in: action({
      name: "search-cell-menu-in",
      label: "Filter in field",
      listener(dispatch, {name, value, type}) {
        dispatch(appendQueryIn(brim.field({name, type, value})))
        dispatch(submitSearch())
      }
    }),
    jumpToTime: action({
      name: "search-cell-menu-show-context",
      label: "View in full context",
      listener(dispatch, fieldData, log) {
        let field = brim.field(fieldData)
        let brimTime = brim.time(field.toDate())
        if (field.type === "time") {
          dispatch(tab.setFrom(brimTime.subtract(1, "minutes").toTs()))
          dispatch(tab.setTo(brimTime.add(1, "minutes").toTs()))
          dispatch(SearchBar.clearSearchBar())
          dispatch(submitSearch()).then(() => {
            dispatch(scrollToLog(log))
          })
        }
      }
    }),
    notIn: action({
      name: "search-cell-menu-not-in",
      label: "Filter not in field",
      listener(dispatch, {name, value, type}) {
        dispatch(appendQueryNotIn(brim.field({name, type, value})))
        dispatch(submitSearch())
      }
    }),
    logResult: action({
      name: "search-cell-menu-log-result",
      label: "Log result to console",
      listener(_dispatch, field, log) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    pcaps: action({
      name: "search-cell-menu-pcaps",
      label: "Download PCAPS",
      listener(dispatch, log) {
        log = new Log(log.tuple, log.descriptor)
        dispatch(downloadPcap(log))
      }
    }),
    sortAsc: action({
      name: "search-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, field) {
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(submitSearch())
      }
    }),
    sortDesc: action({
      name: "search-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, field) {
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(submitSearch())
      }
    }),
    toTime: action({
      name: "search-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, fieldData) {
        let field = brim.field(fieldData)
        if (field.type === "time") {
          dispatch(
            tab.setTo(
              brim
                .time(field.toDate())
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
      listener(_dispatch, field) {
        open(virusTotal.url(field.value))
      }
    }),
    whoisRightclick: action({
      name: "search-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, field) {
        dispatch(Modal.show("whois", {addr: field.value}))
      }
    })
  }
}

export default buildSearchActions()
