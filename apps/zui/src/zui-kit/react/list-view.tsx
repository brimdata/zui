import {isEqual} from "lodash"
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import {FixedSizeList, ListChildComponentProps} from "react-window"
import {ListViewApi} from "../core"
import {createListView} from "../core/list-view/create-list-view"
import {defaultListViewState} from "../core/list-view/state"
import {ListViewArgs} from "../core/list-view/types"
import {ReactAdapterProps} from "./types"
import {useStateControllers} from "./use-state-controllers"
import {useInitialScrollPosition, useOnScroll} from "./utils"
import classNames from "classnames"
import {useParentSize} from "../utils/use-parent-size"

const padding = 8

export const InnerElement = forwardRef<any, any>(function Inner(props, ref) {
  const {style, ...rest} = props
  const height = `${parseFloat(style.height) + (padding ?? 0) * 2}px`

  return <div role="list" ref={ref} style={{...style, height}} {...rest} />
})

export const Row: React.ComponentType<
  React.PropsWithChildren<ListChildComponentProps>
> = React.memo(
  function Row({style, index, data}) {
    if (!data[index]) return null
    const {render, indent} = data[index]
    const innerStyle = {
      paddingLeft: `calc(var(--gutter) * ${indent + 1})`,
      top: (style.top as number) + padding,
    }

    return (
      <div role="row" className="zed-view" style={{...style, ...innerStyle}}>
        {render}
      </div>
    )
  },
  (prev, next) => {
    return (
      prev.data[prev.index] === next.data[next.index] &&
      prev.index === next.index &&
      isEqual(prev.style, next.style)
    )
  }
)

export const ListView = forwardRef(function ListView(
  props: ListViewArgs & ReactAdapterProps,
  ref: React.Ref<ListViewApi>
) {
  const controllers = useStateControllers(props, defaultListViewState)
  const args = {...props, ...controllers}
  const outerRef = useRef<HTMLDivElement>()
  const list = useMemo(() => createListView(args), [props])
  const [rendered, setRendered] = useState({startIndex: 0, stopIndex: 10})
  list.rendered = rendered
  list.fill()
  useOnScroll(outerRef, list.onScroll.bind(list))
  useInitialScrollPosition(outerRef, props.initialScrollPosition)
  useImperativeHandle(ref, () => list, [list])
  useEffect(() => {
    list.element = outerRef.current
  }, [list])

  const {width, height} = useParentSize(outerRef)
  list.width = width
  list.height = height
  return (
    <FixedSizeList
      className={classNames(props.className, "zed-list-view")}
      innerRef={props.innerRef}
      height={props.height ?? height}
      width={props.width ?? width}
      outerRef={outerRef}
      itemCount={list.count}
      itemSize={list.rowHeight}
      itemData={[...list.rows]}
      itemKey={(i) => i.toString()}
      innerElementType={InnerElement}
      overscanCount={8}
      onItemsRendered={(args) => {
        setRendered({
          startIndex: args.overscanStartIndex,
          stopIndex: args.overscanStopIndex,
        })
      }}
    >
      {Row}
    </FixedSizeList>
  )
})
