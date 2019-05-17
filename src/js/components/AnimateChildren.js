/* @flow */
import React from "react"

function move(diff) {
  return [
    [{transform: `translateY(${diff}px)`}, {transform: "translateY(0px)"}],
    {duration: 300, easing: "ease"}
  ]
}

function enter() {
  return [
    [{opacity: 0}, {opactiy: 1}],
    {
      duration: 300,
      delay: 300,
      fill: "backwards",
      easing: "ease"
    }
  ]
}

type Props = {
  children: *
}

export default class AnimateChildren extends React.Component<Props> {
  parent: {current: null | HTMLDivElement}

  constructor(props: Props) {
    super(props)
    this.parent = React.createRef()
  }

  getSnapshotBeforeUpdate({children}: Props) {
    let cache = {}
    let parent = this.parent.current
    if (!parent) return

    React.Children.forEach(children, (child, i) => {
      let el = parent.children[i]
      let key = child.key
      cache[key] = el.getBoundingClientRect()
    })

    return cache
  }

  componentDidUpdate(_p: Props, _s: *, cache: Object) {
    let {children} = this.props
    let parent = this.parent.current
    if (!parent) return

    React.Children.forEach(children, (child, i) => {
      let el = parent.children[i]
      let key = child.key
      let curr = el.getBoundingClientRect()
      let prev = cache[key]

      if (prev) {
        let diff = prev.top - curr.top
        if (diff) animate(el, move(diff))
      } else {
        animate(el, enter())
      }
    })
  }

  render() {
    let {children, ...rest} = this.props
    return (
      <div {...rest} ref={this.parent}>
        {children}
      </div>
    )
  }
}

function animate(el: HTMLElement, args) {
  // $FlowFixMe
  el.animate(...args)
}
