import Ast from "./models/Ast"
import {toTs, toDate} from "./cast"
import trim from "lodash/trim"

export const extractLastTimeWindow = program => {
  if (containsTimeWindow(program))
    return getTimeWindowNodes(program).map(node => toDate(node.value.value))
  else return null
}

export function changeProgramTimeWindow(program, [from, to]) {
  if (containsTimeWindow(program)) {
    program = replaceTsValue(program, getTimeWindowNodes(program)[0], from)
    program = replaceTsValue(program, getTimeWindowNodes(program)[1], to)
  } else {
    program = trim(`(ts >= ${toTs(from)} and ts < ${toTs(to)}) ` + program)
  }
  return program
}

export function getTimeWindowNodes(program) {
  const ast = new Ast(program)
  if (ast) {
    return [
      ast.findNode(isTimeWindowFromNode),
      ast.findNode(isTimeWindowToNode)
    ]
  } else {
    return []
  }
}

export function containsTimeWindow(program) {
  const [fromNode, toNode] = getTimeWindowNodes(program)

  return !!(fromNode && toNode)
}

const isTimeWindowFromNode = node => {
  return (
    node !== undefined &&
    node.op === "CompareField" &&
    node.comparator === "gte" &&
    node.field === "ts" &&
    node.value.type === "double"
  )
}

const isTimeWindowToNode = node => {
  return (
    node !== undefined &&
    node.op === "CompareField" &&
    node.comparator === "lt" &&
    node.field === "ts" &&
    node.value.type === "double"
  )
}

function replaceTsValue(program, astNode, newDate) {
  return splice(
    program,
    astNode.value.location.start.column - 1,
    astNode.value.location.end.column - 1,
    toTs(newDate)
  )
}

function splice(string, start, end, replacement) {
  return string.slice(0, start) + replacement + string.slice(end)
}
