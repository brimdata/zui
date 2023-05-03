import React, {useEffect, useState} from "react"
import TextContent from "./TextContent"
import Icon from "src/app/core/icon-temp"
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
        <Icon name="zui" fill="var(--orange)" size={64} />
      </div>
      <TextContent>
        <div className="about-content">
          <section>
            <label>Version</label>
            <p>{props.version}</p>
          </section>
          <section>
            <label>Website</label>
            <a onClick={() => invoke("openLinkOp", props.website)}>
              {props.website}
            </a>
          </section>
          <section>
            <label>Source</label>
            <a onClick={() => invoke("openLinkOp", props.repository)}>
              {props.repository}
            </a>
          </section>
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
