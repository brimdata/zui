/* @flow */

import type {DataCell} from "../components/Tables/types"
import type {State} from "../reducers/types"
import {
  countBy,
  detail,
  exclude,
  freshInclude,
  fromTime,
  groupByDrillDown,
  include,
  pcaps,
  seperator,
  toTime,
  whois
} from "../components/FieldActionData"
import {flattenJoin} from "../lib/Array"
import {getCurrentSpace} from "../reducers/spaces"
import {getPrevSearchProgram} from "./searchBar"
import {getResultsTab} from "../reducers/view"
import {hasGroupByProc} from "../lib/Program"
import Field, {TimeField} from "../models/Field"
import FieldFactory from "../models/FieldFactory"
import Log from "../models/Log"

type Props = {
  field: Field,
  log: Log
}

export const getViewerFieldActions = (state: State, props: Props) => {
  const field = props.field
  const log = props.log
  const space = getCurrentSpace(state)
  const program = getPrevSearchProgram(state)
  const tab = getResultsTab(state)

  const queryActions = []
  const fieldActions = []
  const logActions = []

  if (hasGroupByProc(program)) {
    queryActions.push(groupByDrillDown(program, log))
  }

  if (tab === "logs" && !(field instanceof TimeField)) {
    queryActions.push(exclude(field))
    queryActions.push(include(field))
    queryActions.push(countBy(field))
  }

  if (!(field instanceof TimeField)) {
    queryActions.push(freshInclude(field))
  }

  if (field instanceof TimeField) {
    queryActions.push(fromTime(field))
    queryActions.push(toTime(field))
  }

  if (["addr", "set[addr]"].includes(props.field.type)) {
    fieldActions.push(whois(props.field))
  }

  if (tab === "logs" && log.isPath("conn") && space.packet_support) {
    logActions.push(pcaps(log))
  }

  logActions.push(detail(log))

  return flattenJoin([queryActions, fieldActions, logActions], seperator())
}

export function rightClickFieldsPanel(cell: DataCell) {
  const field = FieldFactory.create(cell)
  const queryActions = []
  const fieldActions = []
  const logActions = []

  if (!(field instanceof TimeField)) {
    queryActions.push(freshInclude(field))
  }

  if (field instanceof TimeField) {
    queryActions.push(fromTime(field))
    queryActions.push(toTime(field))
  }

  if (["addr", "set[addr]"].includes(field.type)) {
    fieldActions.push(whois(field))
  }

  return flattenJoin([queryActions, fieldActions, logActions], seperator())
}

export const getDetailFieldActions = (state: State, props: Props) => {
  const field = props.field

  const queryActions = []
  const fieldActions = []
  const logActions = []

  if (!(field instanceof TimeField)) {
    queryActions.push(freshInclude(field))
  }

  if (field instanceof TimeField) {
    queryActions.push(fromTime(field))
    queryActions.push(toTime(field))
  }

  if (["addr", "set[addr]"].includes(props.field.type)) {
    fieldActions.push(whois(props.field))
  }

  return flattenJoin([queryActions, fieldActions, logActions], seperator())
}
