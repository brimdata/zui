import React from "react"
export default function ThreeDots(props: any) {
  return (
    <svg {...props} width="22" height="22" viewBox="0 0 22 22">
      <circle cx="5" cy="11" r="2" />
      <circle cx="11" cy="11" r="2" />
      <circle cx="17" cy="11" r="2" />
    </svg>
  )
}
