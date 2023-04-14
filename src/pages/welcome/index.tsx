import React from "react"
import {connectToLake} from "src/app/commands/connect-to-lake"
import {newPool} from "src/app/commands/new-pool"
import {H1} from "src/components/h1"
import {InputButton} from "src/components/input-button"
import {Subtitle} from "src/components/subtitle"
import {Title} from "src/components/title"
import styled from "styled-components"
import links from "src/app/core/links"

const BG = styled.div`
  background-image: url(/welcome-page-background.svg);
  height: 100%;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${H1} {
    margin-bottom: 24px;
  }
`

const Card = styled.section`
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  width: 400px;
  border-radius: 8px;
  padding: 30px 50px 50px;
  box-shadow: 0 22px 80px hsla(0 0% 72% / 0.8);
  border: 1px solid hsl(0 0% 85%);
`

const Actions = styled.section`
  display: flex;
  flex-flow: column;
  gap: 16px;
  width: 100%;
`

export function WelcomePage() {
  return (
    <BG>
      <Title>
        Welcome to <span>Zui</span>
      </Title>
      <Subtitle>Zed User Interface</Subtitle>
      <Card>
        <H1>Get Started</H1>
        <Actions>
          <InputButton onClick={() => newPool.run()}>Import Data</InputButton>
          <InputButton onClick={() => connectToLake.run()}>
            Connect to Lake
          </InputButton>
          <InputButton
            onClick={() => global.zui.invoke("openLinkOp", links.ZUI_DOCS_ROOT)}
          >
            Documentation
          </InputButton>
        </Actions>
      </Card>
    </BG>
  )
}
