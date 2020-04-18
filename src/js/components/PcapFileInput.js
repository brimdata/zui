/* @flow */
import React from "react"

import ArrowOrangeSvg from "../icons/arrow-orange.svg"
import PcapFileSvg from "../icons/pcap-file.svg"
import {reactElementProps} from "../test/integration"

type Props = {
  onChange: Function
}

export default function PcapFileInput({onChange}: Props) {
  function _onChange(e) {
    let paths = Array.from(e.target.files).map((f) => f.path)
    onChange(e, paths)
  }

  return (
    <div className="pcap-file-input">
      <PcapFileSvg className="pcap-file" />
      <ArrowOrangeSvg className="upload-arrow" />
      <input
        type="file"
        multiple
        title=""
        onChange={_onChange}
        {...reactElementProps("pcapsFileInput")}
      />
    </div>
  )
}
