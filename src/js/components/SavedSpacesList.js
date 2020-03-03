/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import {initSpace} from "../flows/initSpace"
import FileFill from "../icons/FileFill"

type Props = {|
  files: string[]
|}

export default function SavedSpacesList({files}: Props) {
  let dispatch = useDispatch()

  function onClick(space) {
    dispatch(initSpace(space))
  }

  return (
    <div className="saved-spaces-list">
      {files.map((file) => (
        <a className="item" onClick={() => onClick(file)} key={file} href="#">
          <FileFill className="file-icon" />
          <span className="name">{file}</span>
          <div className="line" />
        </a>
      ))}
    </div>
  )
}
