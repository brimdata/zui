/* @flow */
import React from "react"

export default function CheckCircle() {
  return (
    <svg
      className="check-circle"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      version="1.1"
    >
      <defs>
        <filter
          x="-15.6%"
          y="-15.6%"
          width="131.2%"
          height="131.2%"
          filterUnits="objectBoundingBox"
          id="check-circle-filter-1"
        >
          <feOffset
            dx="0"
            dy="0"
            in="SourceAlpha"
            result="shadowOffsetOuter1"
          />
          <feGaussianBlur
            stdDeviation="0.5"
            in="shadowOffsetOuter1"
            result="shadowBlurOuter1"
          />
          <feColorMatrix
            values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.202797203 0"
            type="matrix"
            in="shadowBlurOuter1"
            result="shadowMatrixOuter1"
          />
          <feMerge>
            <feMergeNode in="shadowMatrixOuter1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g
        id="checkbox"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Check-Box"
          filter="url(#check-circle-filter-1)"
          transform="translate(1.000000, 1.000000)"
          stroke="#FFFFFF"
        >
          <circle strokeWidth="0.5" fill="#3A79C2" cx="8" cy="8" r="7.75" />
          <polyline points="4 9.098126 7.22882668 11.4772448 12.3469318 4.5" />
        </g>
      </g>
    </svg>
  )
}
