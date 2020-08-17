/* @flow */
import {useDispatch} from "react-redux"
import React, {useEffect, useState} from "react"
import styled from "styled-components"

import BrimTextLogo from "./BrimTextLogo"
import TabCreateSpace from "./TabCreateSpace"
import TabImport from "./TabImport"
import electronIsDev from "../electron/isDev"
import initNewTab from "../flows/initNewTab"
import {cssVar} from "../lib/cssVar"
import {darken} from "polished"

const blueDark = darken(0.15, cssVar("--havelock", "blue"))

const TabWelcomeWrapper = styled.div`
  animation: fadein 300ms;
  background: linear-gradient(to bottom, white 25%, var(--snow));
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 0 70px;

  a {
    color: ${blueDark};
    text-decoration: underline;
    cursor: pointer;
  }

  ${BrimTextLogo} {
    margin: 60px auto;
  }

  .space-deleted {
    margin: 10px auto;
  }

  section {
    max-width: 460px;
    width: 100%;
    margin: 0 auto;
  }

  .input-methods {
    margin: 0 auto 20px auto;
    display: flex;
    width: 100%;
    justify-content: center;
    min-height: 300px;

    section {
      flex: 1;
      min-height: 0px;
      min-width: 200px;
      max-width: 460px;
      display: flex;
      flex-direction: column;
    }
  }

  h2 {
    display: block;
    ${(props) => props.theme.typography.headingSection}
    margin-bottom: 24px;
    user-select: none;
    padding-left: 2px;
  }

  footer {
    padding-left: 2px;
    ${(props) => props.theme.typography.labelSmall}
  }
`

const Nav = styled.nav`
  margin-top: auto;
  margin-bottom: 24px;
  ${(p) => p.theme.typography.labelSmall}
  text-align: center;
  user-select: none;
  a,
  b {
    padding: 0 6px;
  }
  b {
    font-weight: 500;
  }
`

const Link = ({active, onClick, children}) => {
  if (active) return <b>{children}</b>
  else return <a onClick={onClick}>{children}</a>
}

export default function TabWelcome() {
  const dispatch = useDispatch()
  const [page, setPage] = useState("import")

  useEffect(() => {
    dispatch(initNewTab())
  }, [])

  function content() {
    if (page === "import") return <TabImport />
    if (page === "create") return <TabCreateSpace />
    return null
  }

  return (
    <TabWelcomeWrapper>
      <section>
        <BrimTextLogo />
      </section>
      <section>{content()}</section>
      {electronIsDev && (
        <Nav>
          <Link active={page === "import"} onClick={() => setPage("import")}>
            Import Files
          </Link>{" "}
          |
          <Link active={page === "create"} onClick={() => setPage("create")}>
            Create Empty Space
          </Link>
        </Nav>
      )}
    </TabWelcomeWrapper>
  )
}
