import {useEffect, useState} from "react"

export function Show(props: {when: boolean; children: any; delay?: number}) {
  const [show, setShow] = useState(props.when)
  useEffect(() => {
    let id = null
    if (props.when !== show) {
      id = setTimeout(() => {
        setShow(props.when)
      }, props.delay)
    }
    return () => {
      clearTimeout(id)
    }
  }, [props.when, props.delay, show])
  if (show) return props.children
  else return null
}
