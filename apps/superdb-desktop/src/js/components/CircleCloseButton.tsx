import React from "react"
import styled from "styled-components"

const Wrap = styled.button`
  background: none;
  border: none;
  padding: 0;
  width: 16px;
  height: 16px;

  .x {
    fill: white;
    opacity: 0.9;
  }

  &:hover .x {
    opacity: 1;
  }

  .circle {
    fill: white;
    opacity: 0.1;
    transition: opacity 150ms;
  }

  &:hover .circle {
    opacity: 0.2;
  }

  &:active .circle {
    opacity: 0.3;
    transition: none;
  }
`

export function CircleCloseButton({onClick, ...rest}) {
  return (
    <Wrap onClick={onClick} {...rest}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 16 16"
      >
        <g fill="none" fillRule="evenodd">
          <circle className="circle" cx="8" cy="8" r="8" opacity=".1" />
          <path
            className="x"
            d="M0.141230028,7.16392617 L3.30780827,3.99734792 L0.141230028,0.830769679 C-0.044415263,0.65042854 -0.044415263,0.33217947 0.141230028,0.141230028 C0.326875319,-0.0497194141 0.65042854,-0.044415263 0.83607383,0.141230028 L4.00265208,3.30780827 L7.16392617,0.141230028 C7.35487561,-0.044415263 7.66782053,-0.044415263 7.85876997,0.141230028 C8.04971941,0.326875319 8.04441526,0.645124388 7.85876997,0.83607383 L4.69219173,3.99734792 L7.85876997,7.16392617 C8.04441526,7.34957146 8.04441526,7.66782053 7.85876997,7.85876997 C7.67312468,8.04971941 7.35487561,8.04441526 7.16392617,7.85876997 L4.00265208,4.69219173 L0.83607383,7.85876997 C0.65042854,8.04441526 0.33217947,8.04441526 0.141230028,7.85876997 C-0.0497194141,7.67312468 -0.044415263,7.34957146 0.141230028,7.16392617 Z"
            transform="translate(4 4)"
          />
        </g>
      </svg>
    </Wrap>
  )
}
