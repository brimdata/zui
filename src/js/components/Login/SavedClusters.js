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
      <h3>Saved</h3>
      <ul>
        {saved.map((creds) => (
          <li
            key={creds.host + creds.port + creds.username}
            onClick={() => onClick(creds)}
            onContextMenu={() => onRightClick(creds)}
          >
            <svg
              className="star"
              width="24px"
              height="23px"
              viewBox="0 0 24 23"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.918572,21.957364 C19.3764124,22.1922337 18.8989534,22.5482695 18.5203486,22.9913178 L12.489251,18.5745334 L17.638444,14.8112287 L19.918572,21.957364 Z M24.0395526,9.32991886 L17.9773701,13.7604849 L16.0396396,7.68745563 L23.5123951,7.68745563 C23.5623877,8.28403347 23.7484914,8.84190576 24.0395526,9.32991886 Z M11.1596381,-0.11801067 C11.4557471,-0.0449898018 11.7653554,-0.00625336607 12.0840111,-0.00625336607 C12.3583375,-0.00625336607 12.6259586,-0.0349619249 12.884034,-0.0895385536 L15.1573911,7.03537599 L8.86700696,7.03537599 L11.1596381,-0.11801067 Z M-0.0413250002,9.39795297 C0.273562744,8.89402187 0.475039392,8.31194476 0.527370938,7.68745563 L7.98354237,7.68745563 L6.01407064,13.8325316 L-0.0413250002,9.39795297 Z M5.60019645,22.806383 C5.20383839,22.3597321 4.70512251,22.0059673 4.14081938,21.7818593 L6.35174277,14.8834143 L11.3912159,18.5739973 L5.60019645,22.806383 Z M11.9404231,18.1726075 L6.56033293,14.2325787 L8.6580181,7.68745563 L15.3654511,7.68745563 L17.4306692,14.160043 L11.9404231,18.1726075 Z" />
            </svg>
            <div>
              <span className="host">{creds.host}</span>:
              <span className="port">{creds.port}</span>
              <br />
              <span className="username">{creds.username || "(no user)"}</span>
            </div>
            <svg
              className="arrow"
              width="100px"
              height="10px"
              viewBox="0 0 100 10"
              version="1.1"
            >
              <g stroke="none" strokeWidth="1" fill="none">
                <path
                  id="Line"
                  d="M91.5,5.5 L-0.5,5.5 L-0.5,4.5 L91.5,4.5 L91.5,0.5 L100.5,5 L91.5,9.5 L91.5,5.5 Z"
                  fill="#EA6B45"
                  fillRule="nonzero"
                />
              </g>
            </svg>
            {/* <a onClick={() => deleteCreds(creds)}>Delete</a> */}
          </li>
        ))}
      </ul>
    </div>
  )
}
