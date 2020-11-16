import React from "react"
import {zng} from "zealot"

type Props = {log: zng.Record; prev: boolean; children: any}

const NavAnimation = ({children}: Props) => (
  <div className="log-detail-wrapper">{children}</div>
)

export default NavAnimation
