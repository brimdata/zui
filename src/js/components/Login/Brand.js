/* @flow */
import React from "react"

export default function Brand() {
  return (
    <div className="company-name">
      <svg className="company-name-bg" viewBox="0 0 200 168">
        <defs>
          <linearGradient
            x1="50%"
            y1="0%"
            x2="50%"
            y2="99.646326%"
            id="linearGradient-1"
          >
            <stop stopColor="#606474" offset="0%" />
            <stop stopColor="#484C58" offset="100%" />
          </linearGradient>
        </defs>
        <g id="Artboard" fill="url(#linearGradient-1)">
          <path
            d="M0,160 C100,140 100,180 200,160 L200,0 L0,0 L0,100 Z"
            id="Path-2-Copy-2"
          />
        </g>
      </svg>
      <div className="company-name-text">
        <h1>Brim</h1>
      </div>
    </div>
  )
}
