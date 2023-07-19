import React from "react"
export default function Branch(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <g fill="#0F1E2E" transform="translate(4 3)">
          <rect width="1.75" height="13" x="1.1" y="2" fillRule="nonzero" />
          <circle cx="2" cy="15" r="2" />
          <circle cx="2" cy="2" r="2" />
        </g>
        <path
          stroke="#0F1E2E"
          strokeWidth="1.75"
          d="M6.64156212,12.3111263 C14.9986795,11.902891 13.3121652,7.94605922 13.3121652,5"
        />
      </g>
    </svg>
  )
}
