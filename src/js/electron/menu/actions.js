/* @flow */

import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../flows/searchBar/actions"
import open from "../../lib/open"
import {viewLogDetail} from "../../flows/viewLogDetail"
import Log from "../../models/Log"
import Modal from "../../state/Modal"
import Packets from "../../state/Packets"
import SearchBar from "../../state/SearchBar"
import View from "../../state/View"
import action from "./action"
import brim from "../../brim"
import submitSearch from "../../flows/submitSearch"
import tab from "../../state/Tab"
import virusTotal from "../../services/virusTotal"

function buildActions() {
  return {
    countBy: action({
      name: "cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, field) {
        dispatch(appendQueryCountBy(field))
        dispatch(submitSearch())
      }
    }),
    detail: action({
      name: "cell-menu-detail",
      label: "Open details",
      listener(dispatch, log) {
        log = new Log(log.tuple, log.descriptor)
        dispatch(View.showRightSidebar())
        dispatch(viewLogDetail(log))
      }
    }),
    exclude: action({
      name: "cell-menu-exclude",
      label: "Filter != value",
      listener(dispatch, field) {
        dispatch(appendQueryExclude(field))
        dispatch(submitSearch())
      }
    }),
    freshInclude: action({
      name: "cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, field) {
        field = brim.field(field)
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(field.queryableValue()))
        dispatch(submitSearch())
      }
    }),
    fromTime: action({
      name: "cell-menu-from-time",
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
      name: "cell-menu-pivot-to-logs",
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
      name: "cell-menu-include",
      label: "Filter = value",
      listener(dispatch, field) {
        dispatch(appendQueryInclude(field))
        dispatch(submitSearch())
      }
    }),
    in: action({
      name: "cell-menu-in",
      label: "Filter in field",
      listener(dispatch, {name, value, type}) {
        dispatch(appendQueryIn(brim.field({name, type, value})))
        dispatch(submitSearch())
      }
    }),
    notIn: action({
      name: "cell-menu-not-in",
      label: "Filter not in field",
      listener(dispatch, {name, value, type}) {
        dispatch(appendQueryNotIn(brim.field({name, type, value})))
        dispatch(submitSearch())
      }
    }),
    logResult: action({
      name: "cell-menu-log-result",
      label: "Log result to console",
      listener(_dispatch, field, log) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    pcaps: action({
      name: "cell-menu-pcaps",
      label: "Download PCAPS",
      listener(dispatch, log) {
        log = new Log(log.tuple, log.descriptor)
        dispatch(Packets.fetch(log)).then(open, {newWindow: true})
      }
    }),
    sortAsc: action({
      name: "cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, field) {
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(submitSearch())
      }
    }),
    sortDesc: action({
      name: "cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, field) {
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(submitSearch())
      }
    }),
    toTime: action({
      name: "cell-menu-to-time",
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
      name: "cell-menu-virus-total",
      label: "VirusTotal Lookup",
      listener(_dispatch, field) {
        open(virusTotal.url(field.value))
      }
    }),
    whoisRightclick: action({
      name: "cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, field) {
        dispatch(Modal.show("whois", {addr: field.value}))
      }
    })
  }
}

export default buildActions()
