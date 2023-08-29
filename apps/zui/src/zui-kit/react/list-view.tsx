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
import {mergeRefs, useInitialScrollPosition, useOnScroll} from "./utils"
import classNames from "classnames"
import {useParentSize} from "src/app/core/hooks/use-parent-size"
import {TopShadow, useScrollShadow} from "src/panes/load-pane/scroll-shadow"
import {call} from "src/util/call"

const padding = 8

export const InnerElement = forwardRef<any, any>(function InnerElement(
  {style, ...rest},
  ref
) {
  return (
    <div
      role="list"
      ref={ref}
      style={{
        ...style,
        height: `${parseFloat(style.height) + (padding ?? 0) * 2}px`,
      }}
      {...rest}
    />
  )
})

export const OuterElement = forwardRef<any, any>(function OuterElement(
  {children, ...rest},
  ref
) {
  const shadow = useScrollShadow(200)
  return (
    <div style={{height: "100%", width: "100%", position: "relative"}}>
      <TopShadow
        opacity={shadow.top}
        style={{
          height: "2px",
          background: "linear-gradient(rgba(0,0,0,0.25), transparent)",
        }}
      />
      <div
        {...rest}
        ref={mergeRefs(shadow.ref, ref)}
        onScroll={(e) => {
          call(rest.onScroll, e)
          shadow.onScroll()
        }}
      >
        {children}
      </div>
    </div>
  )
})

export const Row: React.ComponentType<
  React.PropsWithChildren<ListChildComponentProps>
> = React.memo(
  function Row({style, index, data}) {
    if (!data[index]) return null
    const {render, indent} = data[index]
    const innerStyle = {
      paddingLeft: 16 * (indent + 1),
      top: (style.top as number) + padding,
    }

    return (
      <div className="zed-view" style={{...style, ...innerStyle}}>
        {render}
      </div>
    )
  },
  (prev, next) => {
    return (
      prev.data === next.data &&
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
  const list = useMemo(() => createListView(args), [props, controllers])
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

  return (
    <FixedSizeList
      className={classNames(props.className, "zed-list-view")}
      innerRef={props.innerRef}
      height={props.height ?? height}
      width={props.width ?? width}
      outerRef={outerRef}
      itemCount={list.count}
      itemSize={20}
      itemData={[...list.rows]}
      itemKey={(i) => i.toString()}
      innerElementType={InnerElement}
      outerElementType={OuterElement}
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
