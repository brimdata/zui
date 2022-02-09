import {toZql} from "src/js/zql/toZql"
import {decode, zed, zjson} from "@brimdata/zealot"
import brim from "../../../brim"
import {openNewSearchTab} from "../../../flows/openNewSearchWindow"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../../flows/searchBar/actions"
import {viewLogDetail} from "../../../flows/viewLogDetail"
import lib from "../../../lib"
import open from "../../../lib/open"
import virusTotal from "../../../services/virusTotal"
import Modal from "../../../state/Modal"
import SearchBar from "../../../state/SearchBar"
import tab from "../../../state/Tab"
import action from "./action"

function buildDetailActions() {
  return {
    copy: action({
      name: "detail-cell-menu-copy",
      label: "Copy",
      listener(_dispatch, data: zjson.EncodedField) {
        const f = decode(data)
        lib.doc.copyToClipboard(f.data.toString())
      }
    }),
    countBy: action({
      name: "detail-cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, data: zjson.EncodedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryCountBy(decode(data)))
        dispatch(openNewSearchTab())
      }
    }),
    detail: action({
      name: "detail-cell-menu-detail",
      label: "View details",
      listener(dispatch, log: zjson.Object) {
        dispatch(viewLogDetail(decode(log) as zed.Record))
      }
    }),
    exclude: action({
      name: "detail-cell-menu-exclude",
      label: "Filter != value in new search",
      listener(dispatch, field: zjson.EncodedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryExclude(decode(field)))
        dispatch(openNewSearchTab())
      }
    }),
    freshInclude: action({
      name: "detail-cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, field: zjson.EncodedField) {
        const f = decode(field)
        dispatch(SearchBar.clearSearchBar())
        dispatch(SearchBar.changeSearchBarInput(toZql(f.value)))
        dispatch(openNewSearchTab())
      }
    }),
    fromTime: action({
      name: "detail-cell-menu-from-time",
      label: 'Use as "start" time in new search',
      listener(dispatch, fieldJSON: zjson.EncodedField) {
        const field = decode(fieldJSON)
        const data = field.data
        if (data instanceof zed.Time) {
          dispatch(SearchBar.clearSearchBar())
          dispatch(tab.setFrom(brim.time(data.toDate()).toTs()))
          dispatch(openNewSearchTab())
        }
      }
    }),
    groupByDrillDown: action({
      name: "detail-cell-menu-pivot-to-logs",
      label: "Pivot to logs",
      listener(dispatch, program, log: zjson.Object) {
        const newProgram = brim
          .program(program)
          .drillDown(decode(log) as zed.Record)
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
      label: "Filter == value in new search",
      listener(dispatch, field: zjson.EncodedField) {
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQueryInclude(decode(field)))
        dispatch(openNewSearchTab())
      }
    }),
    in: action({
      name: "detail-cell-menu-in",
      label: "Filter in field in new search",
      listener(dispatch, data: zjson.EncodedField, index: number) {
        dispatch(SearchBar.clearSearchBar())
        const field = decode(data)
        if (zed.isIterable(field.value)) {
          const item = field.value.at(index)
          if (item) {
            dispatch(appendQueryIn(field, item))
            dispatch(openNewSearchTab())
          }
        }
      }
    }),
    notIn: action({
      name: "detail-cell-menu-not-in",
      label: "Filter not in field in new search",
      listener(dispatch, data: zjson.EncodedField, index: number) {
        dispatch(SearchBar.clearSearchBar())
        const field = decode(data)
        if (zed.isIterable(field.value)) {
          const item = field.value.at(index)
          if (item) {
            dispatch(appendQueryNotIn(field, item))
            dispatch(openNewSearchTab())
          }
        }
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
    sortAsc: action({
      name: "detail-cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, field: zjson.EncodedField) {
        const f = decode(field)
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQuerySortBy(f.name, "asc"))
        dispatch(openNewSearchTab())
      }
    }),
    sortDesc: action({
      name: "detail-cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, field: zjson.EncodedField) {
        const f = decode(field)
        dispatch(SearchBar.clearSearchBar())
        dispatch(appendQuerySortBy(f.name, "desc"))
        dispatch(openNewSearchTab())
      }
    }),
    toTime: action({
      name: "detail-cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, data: zjson.EncodedField) {
        const field = decode(data)
        if (field.data instanceof zed.Time) {
          dispatch(SearchBar.clearSearchBar())
          dispatch(
            tab.setTo(
              brim
                .time(field.data.toDate())
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
      listener(_dispatch, data: zjson.EncodedField) {
        const field = decode(data)
        open(virusTotal.url(field.data.toString()))
      }
    }),
    whoisRightclick: action({
      name: "detail-cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, data: zjson.EncodedField) {
        const field = decode(data)
        dispatch(Modal.show("whois", {addr: field.data.toString()}))
      }
    })
  }
}

export default buildDetailActions()
