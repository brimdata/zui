import Head from "next/head"
import React, {useEffect, useState} from "react"
import {Provider} from "react-redux"
import {SubscribeToEvents} from "src/components/subscribe-to-events"
import initialize from "src/js/initializers/initialize"

export function ProvideContext(props: {children: any}) {
  const [store, setStore] = useState(null)

  useEffect(() => {
    initialize().then((ctx) => {
      setStore(ctx.store)
    })
  }, [])

  if (!store) return null
  return <Provider store={store}>{props.children}</Provider>
}

export default function BackgroundPage() {
  return (
    <ProvideContext>
      <Head>
        <title>Background</title>
      </Head>
      <SubscribeToEvents />
    </ProvideContext>
  )
}
