import React from "react"
export default function RampLeft(props: any) {
  return (
    <svg
      className="ramp ramp-left"
      width="12px"
      height="12px"
      viewBox="0 0 12 12"
      {...props}
    >
      <g stroke="none" strokeWidth="1" fillRule="evenodd">
        <path
          d="M0,-1.42108547e-13 L0,12 L12,12 C6,12 0,6 0,-1.42108547e-13 Z"
          transform="translate(6.000000, 6.000000) scale(-1, 1) translate(-6.000000, -6.000000) "
        ></path>
      </g>
    </svg>
  )
}
