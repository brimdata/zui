import React from "react"

export default function ThreeDots(props: any) {
  return (
    <svg {...props} width="22" height="22" viewBox="0 0 22 22">
      <circle cx="11" cy="17" r="2" transform="rotate(-90 11 17)" />
      <circle cx="11" cy="11" r="2" transform="rotate(-90 11 11)" />
      <circle cx="11" cy="5" r="2" transform="rotate(-90 11 5)" />
    </svg>
  )
}
