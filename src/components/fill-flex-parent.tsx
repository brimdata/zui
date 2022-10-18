import React, {ReactElement} from "react"
import mergeRefs from "src/app/core/utils/merge-refs"
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

export const FillFlexParent = React.forwardRef(function FillFlexParent(
  props: Props,
  forwardRef
) {
  const {ref, width, height} = useResizeObserver()
  return (
    <Container ref={mergeRefs(ref, forwardRef)}>
      {width && height ? props.children({width, height}) : null}
    </Container>
  )
})
