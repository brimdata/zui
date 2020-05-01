/* @flow */
import {useState} from "react"

/*
  When using this, all the children elements of the dropzone must have a
  css rule of pointer-events: none.
*/

export default function useDropzone(dropCallback: Function) {
  let [dragging, setDragging] = useState(false)

  function onDragOver(e: Event) {
    e.preventDefault()
  }

  function onDrop(e: Event) {
    setDragging(false)
    dropCallback(e)
  }

  function onDragEnter(e: Event) {
    e.preventDefault()
    setDragging(true)
  }

  function onDragLeave(e: Event) {
    e.preventDefault()
    setDragging(false)
  }

  let bind = () => ({
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave
  })

  return [bind, dragging]
}
