import React, {ReactElement} from "react"
import styled from "styled-components"
import useResizeObserver from "use-resize-observer"

type Props = {
  children: (dimens: {width: number; height: number}) => ReactElement
}

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  min-height: 0;
  min-width: 0;
`

export function FillFlexParent(props: Props) {
  const {ref, width, height} = useResizeObserver()
  return (
    <Container ref={ref}>
      {width && height ? props.children({width, height}) : null}
    </Container>
  )
}
