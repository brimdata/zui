import {CSSTransition} from "react-transition-group"
import {useState} from "react"
import {call} from "src/util/call"

export function useDebut(args: {afterExit?: () => any}) {
  const [isExiting, setIsExiting] = useState(false)
  const api = {
    props: {
      afterExit: args.afterExit,
      isExiting,
      setIsExiting,
    },
    exit: () => setIsExiting(true),
    isExiting,
  }

  return api
}

export function Debut(props: {
  afterExit
  children
  isExiting
  setIsExiting
  classNames
}) {
  return (
    <CSSTransition
      classNames={props.classNames}
      appear
      in={!props.isExiting}
      // @ts-ignore
      addEndListener={(node, done) =>
        node.addEventListener("transitionend", done, false)
      }
      onExited={() => {
        call(props.afterExit)
        call(props.setIsExiting, false)
      }}
    >
      {props.children}
    </CSSTransition>
  )
}
