/* @flow */
import React from "react"

import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import LogoType from "../icons/LogoType"
import Octocat from "../icons/Octocat"
import {remote} from "electron"
import {join} from "path"
import open from "../lib/open"

export default function AboutModal() {
  const appVersion = remote.app.getVersion()
  const year = new Date().getFullYear()
  const pathRoot = remote.app.getAppPath()
  const ackFilePath = join(pathRoot, "acknowledgments.txt")
  const licFilePath = join(pathRoot, "LICENSE")

  return (
    <ModalBox
      name="about"
      title=""
      buttons={[]}
      className="about-modal"
      {...reactElementProps("aboutModal")}
    >
      <div className="about-logo">
        <div className="logo">
          <LogoType />
        </div>
      </div>
      <TextContent>
        <div className="about-content">
          <section>
            <label>Version</label>
            <p>{appVersion}</p>
          </section>
          <section>
            <label>Website</label>
            <a onClick={() => open("https://www.brimsecurity.com")}>
              Brim Security, Inc.
            </a>
          </section>
          <section>
            <label>Source</label>
            <div className={"octocat-small"}>
              <Octocat />
            </div>
            <a onClick={() => open("https://github.com/brimsec/brim")}>
              Repository
            </a>
          </section>
          <section>
            <a onClick={() => open(licFilePath)}>License</a>
          </section>
          <section>
            <a onClick={() => open(ackFilePath)}>Acknowledgments</a>
          </section>
          <section>
            <p>Copyright {year} Brim Security, Inc.</p>
          </section>
        </div>
      </TextContent>
    </ModalBox>
  )
}
