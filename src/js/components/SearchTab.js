/* @flow */
import React, {useEffect, useRef} from "react"
import anime from "animejs"
import classNames from "classnames"

import CloseButton from "./CloseButton"
import RampLeft from "../icons/ramp-left.svg"
import RampRight from "../icons/ramp-right.svg"
import TabSpinner from "./TabSpinner"

type Props = {
  title: string,
  className: string,
  loading: boolean,
  removeTab: Function
}

const SearchTab = React.forwardRef<Props, HTMLDivElement>(function SearchTab(
  {title, className, loading, removeTab, ...rest},
  ref
) {
  let aniRef = useRef()

  useEffect(() => {
    let el = aniRef.current
    if (!el) return

    let title = el.querySelector(".title")
    let spinner = el.querySelector(".loading")

    if (loading) {
      anime.remove(title)
      anime.remove(spinner)
      anime({
        targets: title,
        paddingLeft: 40,
        delay: 300
      })
      anime({
        delay: 300,
        targets: spinner,
        translateX: 0
      })
    } else {
      anime.remove(title)
      anime.remove(spinner)
      anime({
        targets: title,
        paddingLeft: 10
      })
      anime({
        targets: spinner,
        translateX: -30
      })
    }
  }, [loading, ref.current])

  return (
    <div ref={ref} {...rest} className={classNames("tab", className)}>
      <div className="tab-content" ref={aniRef}>
        <Loading />
        <p className="title">{title}</p>
        <CloseButton onClick={removeTab} />
      </div>
      <RampRight />
      <RampLeft />
    </div>
  )
})

function Loading() {
  return (
    <div className="loading">
      <TabSpinner />
    </div>
  )
}

export default SearchTab
