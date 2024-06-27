import React from "react"
import "../src/css/main.scss"

export function getInitialProps() {}

export default function MyApp({Component, pageProps}) {
  return <Component {...pageProps} />
}
