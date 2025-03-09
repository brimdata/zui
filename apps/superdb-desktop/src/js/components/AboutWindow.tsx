import React, {useEffect, useState} from "react"
import TextContent from "./TextContent"
import {Icon} from "src/components/icon"
import {EnvAboutApp} from "src/domain/env/types"
import {invoke} from "src/core/invoke"

export default function AboutWindow() {
  const [data, setData] = useState<EnvAboutApp>(null)

  useEffect(() => {
    invoke("env.aboutApp").then(setData)
  }, [])

  if (!data) return null
  else return <Content {...data} />
}

export function Content(props: EnvAboutApp) {
  return (
    <div className="about-window">
      <div className="about-logo">
        <Icon name="zui" fill="var(--orange)" size="64px" />
      </div>
      <TextContent>
        <div className="about-content">
          <div className="about-grid">
            <p className="weight:bold">Version</p>
            <p>{props.version}</p>
            <p className="weight:bold">Website</p>
            <a onClick={() => invoke("openLinkOp", props.website)}>
              {props.website}
            </a>
            <p className="weight:bold">Source</p>
            <a onClick={() => invoke("openLinkOp", props.repository)}>
              {props.repository}
            </a>
          </div>
          <hr />
          <footer>
            <section>
              <a onClick={() => invoke("openLinkOp", props.licensePath)}>
                License
              </a>
            </section>
            <section>
              <a
                onClick={() => invoke("openLinkOp", props.acknowledgementsPath)}
              >
                Acknowledgments
              </a>
            </section>
            <section>
              <p>Copyright {new Date().getFullYear()} Brim Data, Inc.</p>
            </section>
          </footer>
        </div>
      </TextContent>
    </div>
  )
}
