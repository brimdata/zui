/* @flow */
import React from "react"

export default function CheckCircle() {
  return (
    <svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1">
      <defs>
        <filter
          x="-15.6%"
          y="-15.6%"
          width="131.2%"
          height="131.2%"
          filterUnits="objectBoundingBox"
          id="x-circle-filter-1"
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
        id="checkbox-copy"
        stroke="none"
        strokeWidth="1"
        fill="none"
        fillRule="evenodd"
      >
        <g
          id="Check-Box"
          filter="url(#x-circle-filter-1)"
          transform="translate(1.000000, 1.000000)"
          stroke="#FFFFFF"
        >
          <circle
            id="Oval"
            strokeWidth="0.5"
            fill="#E65835"
            cx="8"
            cy="8"
            r="7.75"
          />
          <g
            id="Group"
            transform="translate(4.499049, 4.350000)"
            strokeLinecap="square"
          >
            <path
              d="M3.39393397,0.00229709104 L3.60606603,7.28280572"
              id="Line"
              transform="translate(3.500000, 3.642551) rotate(45.000000) translate(-3.500000, -3.642551) "
            />
            <path
              d="M3.60701752,0 L3.39488548,7.28319985"
              id="Line-Copy"
              transform="translate(3.500951, 3.641600) rotate(-45.000000) translate(-3.500951, -3.641600) "
            />
          </g>
        </g>
      </g>
    </svg>
  )
}
