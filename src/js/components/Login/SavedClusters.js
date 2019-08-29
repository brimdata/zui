/* @flow */
import {useDispatch} from "react-redux"
import React from "react"

import type {Cluster} from "../../state/clusters/types"
import {removeCluster} from "../../state/clusters/actions"
import {showContextMenu} from "../../lib/System"

type Props = {saved: Cluster[], setForm: Function, submit: Function}

export default function SavedClusters({saved, setForm, submit}: Props) {
  let dispatch = useDispatch()

  function onClick(creds) {
    let data = {...creds, save: true}
    setForm({...creds, save: true})
    submit(data)
  }

  function onRightClick(creds) {
    showContextMenu([
      {
        label: "Remove",
        click() {
          dispatch(removeCluster(creds))
        }
      }
    ])
  }

  return (
    <div className="saved-creds">
      <h3 className="section-heading">Saved Connections</h3>
      <ul>
        {saved.map((creds) => (
          <li
            key={creds.host + creds.port + creds.username}
            onClick={() => onClick(creds)}
            onContextMenu={() => onRightClick(creds)}
          >
            <div>
              <span className="host">{creds.host}</span>:
              <span className="port">{creds.port}</span>
              <br />
              <span className="username">{creds.username || "(no user)"}</span>
            </div>

            {/* <a onClick={() => deleteCreds(creds)}>Delete</a> */}
          </li>
        ))}
      </ul>
    </div>
  )
}
