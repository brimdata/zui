import React from "react"

import styled from "styled-components"

function Folder(props: any) {
  return (
    <svg width="22px" height="22px" viewBox="0 0 22 22" {...props}>
      <g id="folder" stroke="none" strokeWidth="1" fillRule="evenodd">
        <path
          d="M18.7885274,3.75171233 C20.8792808,3.75171233 22,4.87243151 22,6.94434932 L22,7.94263699 L0,7.94263699 L0,5.15496575 C0,3.10188356 1.12071918,2 2.9760274,2 L5.75428082,2 C6.79023973,2 7.27996575,2.17893836 7.97688356,2.73458904 L8.48544521,3.1489726 C9.04109589,3.59160959 9.46489726,3.75171233 10.1712329,3.75171233 L18.7885274,3.75171233 Z M3.2114726,20.072774 C1.12071918,20.072774 0,18.9614726 0,16.880137 L0,9.39297945 L22,9.39297945 L22,16.880137 C22,18.9520548 20.8886986,20.072774 18.9768836,20.072774 L3.2114726,20.072774 Z"
          id="folder-shape"
          fillRule="nonzero"
        ></path>
      </g>
    </svg>
  )
}

export default styled(Folder)``
