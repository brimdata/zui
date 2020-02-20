/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import os from "os"

import {useGlobalDispatch, useGlobalSelector} from "../state/GlobalContext"
import FileFill from "../icons/FileFill"
import RecentFiles from "../state/RecentFiles"
import Search from "../state/Search"

let homedir = os.homedir()

export default function SavedSpacesList() {
  let dispatch = useDispatch()
  let globalDispatch = useGlobalDispatch()
  let files = useGlobalSelector(RecentFiles.getPaths)

  function onClick(space) {
    dispatch(Search.setSpace(space))
    globalDispatch(RecentFiles.open(space))
  }

  function format(file) {
    return file.replace(homedir, "~")
  }

  return (
    <div className="saved-spaces-list">
      {files.map((file) => (
        <a onClick={() => onClick(file)} key={file} href="#">
          <FileFill className="file-icon" />
          <span className="name">{format(file)}</span>
          <div className="line" />
        </a>
      ))}
    </div>
  )
}
