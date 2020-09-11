import React from "react"

import {Cluster} from "../../state/Clusters/types"

type Props = {
  saved: Cluster[]
  onClick: Function
  onRightClick: Function
}

export default function SavedClusters({saved, onClick, onRightClick}: Props) {
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
            <span className="host">{creds.host}</span>:
            <span className="port">{creds.port}</span>
            <br />
            <span className="username">{creds.username || "(no user)"}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
