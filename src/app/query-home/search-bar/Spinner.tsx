import {useSelector} from "react-redux"
import React from "react"
import styled from "styled-components"

import MacSpinner from "src/js/components/MacSpinner"
import useDelayedMount from "src/js/components/hooks/useDelayedMount"
import Viewer from "src/js/state/Viewer"

const Wrap = styled.div`
  animation: fadein 300ms;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  .mac-spinner {
    transform: scale(0.6);
  }
`

export default function Spinner() {
  const isFetching = useSelector(Viewer.isFetching)
  const ready = useDelayedMount(isFetching, 100)
  if (!ready) return null

  return (
    <Wrap>
      <MacSpinner />
    </Wrap>
  )
}
