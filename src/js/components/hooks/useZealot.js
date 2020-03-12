/* @flow */
import {useMemo} from "react"
import {useSelector} from "react-redux"

import Tab from "../../state/Tab"
import zealot from "../../services/zealot"

export default function useZealot() {
  let url = useSelector(Tab.clusterUrl)
  return useMemo(() => zealot.client(url), [url])
}
