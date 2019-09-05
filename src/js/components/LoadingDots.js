/* @flow */
import React from "react"

export default function LoadingDots() {
  return (
    <svg
      className="loading-dots"
      width="18px"
      height="18px"
      viewBox="0 0 18 18"
      version="1.1"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          id="Check-Box"
          transform="translate(4.000000, 8.000000)"
          fill="#B3B3B3"
        >
          <circle cx="1" cy="1" r="1" />
          <circle cx="5" cy="1" r="1" />
          <circle cx="9" cy="1" r="1" />
        </g>
      </g>
    </svg>
  )
}
