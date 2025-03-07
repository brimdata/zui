import React, {ReactElement} from "react"
import mergeRefs from "src/util/merge-refs"
import useResizeObserver from "use-resize-observer"

type Props = {
  children: (dimens: {width: number; height: number}) => ReactElement
}

export const FillFlexParent = React.forwardRef(function FillFlexParent(
  props: Props,
  forwardRef
) {
  const {ref, width, height} = useResizeObserver()
  return (
    <div
      ref={mergeRefs(ref, forwardRef)}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        minHeight: 0,
        minWidth: 0,
      }}
    >
      {width && height ? props.children({width, height}) : null}
    </div>
  )
})
