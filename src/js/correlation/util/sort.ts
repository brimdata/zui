import {zng} from "zealot"

export const sort = (logs: zng.Record[]) => {
  const findConn = (log) => log.try("_path")?.toString() === "conn"
  return toFront(sortBy(logs, "ts"), findConn)
}

function sortBy(logs: zng.Record[], name: string, dir: "asc" | "desc" = "asc") {
  const direction = dir === "asc" ? 1 : -1

  logs.sort((a, b) =>
    a.try(name)?.toString() > b.try(name)?.toString()
      ? direction
      : direction * -1
  )

  return logs
}

const toFront = (array: any[], accessor: (arg0: any) => boolean) => {
  const copy = [...array]
  const index = copy.findIndex(accessor)

  if (index > 0) copy.splice(0, 0, copy.splice(index, 1)[0])

  return copy
}
