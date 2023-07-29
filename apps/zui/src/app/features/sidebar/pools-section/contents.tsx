import React from "react"
import {useSelector} from "react-redux"
import useLakeId from "src/app/router/hooks/use-lake-id"
import LakeStatuses from "src/js/state/LakeStatuses"
import {Empty} from "./empty"
import {PoolsTree} from "./pools-tree"

export function Contents(props: {searchTerm: string}) {
  const lakeId = useLakeId()
  const lakeStatus = useSelector(LakeStatuses.get(lakeId))
  switch (lakeStatus) {
    case "disconnected":
      return <Empty message="Unable to connect to service." />
    case "login-required":
      return <Empty message="Login required to view pools." />
    default:
      return <PoolsTree searchTerm={props.searchTerm} />
  }
}
