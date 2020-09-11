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
import tab from "../../../state/Tab"
import virusTotal from "../../../services/virusTotal"
import {downloadPcap} from "../../../flows/downloadPcap"
import {openNewSearchTab} from "../../../flows/openNewSearchWindow"

function buildDetailActions() {
  return {
    countBy: action({
      name: "detail-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, field) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryCountBy(field))
        dispatch(openNewSearchTab())
      }
    }),
    detail: action({
      name: "detail-cell-menu-detail",
      label: "View details",
      listener(dispatch, log) {
        log = new Log(log.tuple, log.descriptor)
        dispatch(viewLogDetail(log))
      }
    }),
    exclude: action({
      name: "detail-cell-menu-exclude",
      label: "Filter != value in new search",
      listener(dispatch, field) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryExclude(field))
        dispatch(openNewSearchTab())
      }
    }),
    freshInclude: action({
      name: "detail-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, field) {
        field = brim.field(field)
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(field.queryableValue()))
        dispatch(openNewSearchTab())
      }
    }),
    fromTime: action({
      name: "detail-cell-menu-from-time",
      label: 'Use as "start" time in new search',
      listener(dispatch, fieldData) {
        let field = brim.field(fieldData)
        if (field.type === "time") {
          dispatch(SearchBar.clearSearchBar())
          dispatch(tab.setFrom(brim.time(field.toDate()).toTs()))
          dispatch(openNewSearchTab())
        }
      }
    }),
    groupByDrillDown: action({
      name: "detail-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program, log) {
        let newProgram = brim
          .program(program)
          .drillDown(brim.log(log.tuple, log.descriptor))
          .string()

        if (newProgram) {
          dispatch(SearchBar.clearSearchBar())
          dispatch(SearchBar.changeSearchBarInput(newProgram))
          dispatch(openNewSearchTab())
        }
      }
    }),
    include: action({
      name: "detail-cell-menu-include",
      label: "Filter = value in new search",
      listener(dispatch, field) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryInclude(field))
        dispatch(openNewSearchTab())
      }
    }),
    in: action({
      name: "detail-cell-menu-in",
      label: "Filter in field in new search",
      listener(dispatch, {name, value, type}) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryIn(brim.field({name, type, value})))
        dispatch(openNewSearchTab())
      }
    }),
    notIn: action({
      name: "detail-cell-menu-not-in",
      label: "Filter not in field in new search",
      listener(dispatch, {name, value, type}) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryNotIn(brim.field({name, type, value})))
        dispatch(openNewSearchTab())
      }
    }),
    logResult: action({
      name: "detail-cell-menu-log-result",
      label: "Log result to console",
      listener(_dispatch, field, log) {
        console.log(JSON.stringify(log))
        console.log(JSON.stringify(field))
      }
    }),
    pcaps: action({
      name: "detail-cell-menu-pcaps",
      label: "Download PCAPS",
      listener(dispatch, log) {
        log = new Log(log.tuple, log.descriptor)
        dispatch(downloadPcap(log))
      }
    }),
    sortAsc: action({
      name: "detail-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, field) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(openNewSearchTab())
      }
    }),
    sortDesc: action({
      name: "detail-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, field) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(openNewSearchTab())
      }
    }),
    toTime: action({
      name: "detail-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, fieldData) {
        let field = brim.field(fieldData)
        if (field.type === "time") {
          dispatch(SearchBar.clearSearchBar())
          dispatch(
            tab.setTo(
              brim
                .time(field.toDate())
                .add(1, "ms")
                .toTs()
            )
          )
          dispatch(openNewSearchTab())
        }
      }
    }),
    virusTotalRightclick: action({
      name: "detail-cell-menu-virus-total",
      label: "VirusTotal Lookup",
      listener(_dispatch, field) {
        open(virusTotal.url(field.value))
      }
    }),
    whoisRightclick: action({
      name: "detail-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, field) {
        dispatch(Modal.show("whois", {addr: field.value}))
      }
    })
  }
}

export default buildDetailActions()
