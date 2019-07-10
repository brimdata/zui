/* @flow */
import {useSelector} from "react-redux"
import React from "react"

import type {Cluster} from "../state/clusters/types"
import {getAllSpaceNames, getCurrentSpace} from "../state/reducers/spaces"
import SearchPage from "./SearchPage"
import SearchPageLoading from "./SearchPageLoading"
import SpacesPage from "./Login/SpacesPage"

type Props = {
  cluster: Cluster
}

export default function SearchPageGate({cluster}: Props) {
  let spaces = useSelector(getAllSpaceNames)
  let space = useSelector(getCurrentSpace)

  if (space) {
    return <SearchPage />
  } else if (spaces.length === 0) {
    return <SpacesPage cluster={cluster} />
  } else {
    return <SearchPageLoading />
  }
}
