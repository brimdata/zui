/* @flow */

import {TimeField} from "../../models/Field"
import {add} from "../../lib/Time"
import {
  appendQueryCountBy,
  appendQueryExclude,
  appendQueryIn,
  appendQueryInclude,
  appendQueryNotIn,
  appendQuerySortBy
} from "../../searchBar/actions"
import {
  changeSearchBarInput,
  clearSearchBar,
  setOuterFromTime,
  setOuterToTime,
  showRightSidebar
} from "../../state/actions"
import {fetchPackets} from "../../state/thunks/packets"
import {open} from "../../lib/System"
import {submitSearchBar} from "../../state/thunks/searchBar"
import {viewLogDetail} from "../../detail/viewLogDetail"
import FieldFactory from "../../models/FieldFactory"
import Log from "../../models/Log"
import action from "./action"
import brim from "../../brim"
import external from "../../external"
import modal from "../../modal"

function buildActions() {
  return {
    countBy: action({
      name: "cell-menu-count-by",
      label: "Count by field",
      listener(dispatch, field) {
        dispatch(appendQueryCountBy(field))
        dispatch(submitSearchBar())
      }
    }),
    detail: action({
      name: "cell-menu-detail",
      label: "Open details",
      listener(dispatch, log) {
        log = new Log(log.tuple, log.descriptor)
        dispatch(showRightSidebar())
        dispatch(viewLogDetail(log))
      }
    }),
    exclude: action({
      name: "cell-menu-exclude",
      label: "Filter != value",
      listener(dispatch, field) {
        dispatch(appendQueryExclude(field))
        dispatch(submitSearchBar())
      }
    }),
    freshInclude: action({
      name: "cell-menu-fresh-include",
      label: "New search with this value",
      listener(dispatch, field) {
        field = FieldFactory.create(field)
        dispatch(clearSearchBar())
        dispatch(changeSearchBarInput(field.queryableValue()))
        dispatch(submitSearchBar())
      }
    }),
    fromTime: action({
      name: "cell-menu-from-time",
      label: 'Use as "start" time',
      listener(dispatch, field) {
        field = FieldFactory.create(field)
        if (field instanceof TimeField) {
          dispatch(setOuterFromTime(field.toDate()))
          dispatch(submitSearchBar())
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
          dispatch(clearSearchBar())
          dispatch(changeSearchBarInput(newProgram))
          dispatch(submitSearchBar())
        }
      }
    }),
    include: action({
      name: "cell-menu-include",
      label: "Filter = value",
      listener(dispatch, field) {
        dispatch(appendQueryInclude(field))
        dispatch(submitSearchBar())
      }
    }),
    in: action({
      name: "cell-menu-in",
      label: "Filter in field",
      listener(dispatch, {name, value, type}) {
        dispatch(appendQueryIn(brim.field(name, type, value)))
        dispatch(submitSearchBar())
      }
    }),
    notIn: action({
      name: "cell-menu-not-in",
      label: "Filter not in field",
      listener(dispatch, {name, value, type}) {
        dispatch(appendQueryNotIn(brim.field(name, type, value)))
        dispatch(submitSearchBar())
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
        dispatch(fetchPackets(log)).then(open)
      }
    }),
    sortAsc: action({
      name: "cell-menu-sort-asc",
      label: "Sort A...Z",
      listener(dispatch, field) {
        dispatch(appendQuerySortBy(field.name, "asc"))
        dispatch(submitSearchBar())
      }
    }),
    sortDesc: action({
      name: "cell-menu-sort-desc",
      label: "Sort Z...A",
      listener(dispatch, field) {
        dispatch(appendQuerySortBy(field.name, "desc"))
        dispatch(submitSearchBar())
      }
    }),
    toTime: action({
      name: "cell-menu-to-time",
      label: 'Use as "end" time',
      listener(dispatch, field) {
        field = FieldFactory.create(field)
        if (field instanceof TimeField) {
          dispatch(setOuterToTime(add(field.toDate(), 1, "ms")))
          dispatch(submitSearchBar())
        }
      }
    }),
    virusTotalRightclick: action({
      name: "cell-menu-virus-total",
      label: "VirusTotal Lookup",
      listener(_dispatch, field) {
        open(external.virusTotalUrl(field.value))
      }
    }),
    whoisRightclick: action({
      name: "cell-menu-who-is",
      label: "Whois Lookup",
      listener(dispatch, field) {
        dispatch(modal.show("whois", {addr: field.value}))
      }
    })
  }
}

export default buildActions()
