/* @flow */
import React from "react"

import {reactElementProps} from "../test/integration"
import ModalBox from "./ModalBox/ModalBox"
import TextContent from "./TextContent"
import LogoType from "../icons/LogoType"
import Octocat from "../icons/Octocat"
import {open} from "../lib/System"
import {remote} from "electron"

export default function AboutModal() {
  const appVersion = remote.app.getVersion()

  return (
    <ModalBox
      name="about"
      title="About"
      buttons="Close"
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
        </div>
      </TextContent>
    </ModalBox>
  )
}
