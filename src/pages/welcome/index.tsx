import React from "react"
import {connectToLake} from "src/app/commands/connect-to-lake"
import {newPool} from "src/app/commands/new-pool"
import styled from "styled-components"

const BG = styled.div`
  background-image: url(dist/static/welcome-page-background.svg);
  height: 100%;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Title = styled.h1`
  text-align: center;
  font-size: 60px;
  font-weight: 900;
  span {
    color: var(--orange);
  }
`
const Subtitle = styled.h2`
  font-weight: 300;
  font-size: 32px;
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
`

const Heading = styled.h3`
  font-size: 26px;
  margin-bottom: 12px;
`

const Button = styled.button`
  background: var(--button-background);
  border: none;
  border-radius: 8px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 12px 0;
  font-size: 16px;
  font-weight: 500;
  &:hover {
    background: var(--button-background-hover);
  }
  &:active {
    background: var(--button-background-active);
  }
`

export function WelcomePage() {
  return (
    <BG>
      <Title>
        Welcome to <span>Zui</span>
      </Title>
      <Subtitle>Zed User Interface</Subtitle>
      <Card>
        <Heading>Get Started</Heading>
        <Button onClick={() => newPool.run()}>Import Data</Button>
        <Button onClick={() => connectToLake.run()}>Connect to Lake</Button>
      </Card>
    </BG>
  )
}
