import React from "react"
export default function ChevronLeft(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      {...props}
    >
      <path
        d="M20.75 0l-13.875 13.875-2.125 2.125 2.125 2.125 13.875 13.875h8.5l-16-16 16-16h-8.5z"
        transform="translate(1)"
      />
    </svg>
  )
}
