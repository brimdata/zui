import Ast from "../models/Ast"
import {toTs} from "../cast"

export function fetchUid(space, uid, timeWindow) {
  const ast = new Ast(`${uid} | head 300`).toJSON()
  return {
    method: "POST",
    path: "/search",
    payload: {
      space: space.name,
      search: ast.search,
      proc: ast.proc,
      from: toTs(timeWindow[0]),
      to: toTs(timeWindow[1])
    }
  }
}

export function fetchSchema(space, descriptorId) {
  return {
    method: "GET",
    path: `/space/${space.name}/descriptor/${descriptorId}`
  }
}

export function fetchMainSearch(query) {
  return {
    method: "POST",
    path: "/search",
    payload: {
      space: query.space.name,
      search: query.getAst().search,
      proc: query.getAst().proc,
      from: toTs(query.timeWindow[0]),
      to: toTs(query.timeWindow[1])
    }
  }
}

export function fetchSpaces() {
  return {
    method: "GET",
    path: "/space"
  }
}

export function fetchSpaceInfo(name) {
  return {
    method: "GET",
    path: `/space/${name}`
  }
}
