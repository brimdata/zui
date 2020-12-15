import {serve} from "https://deno.land/std@0.70.0/http/server.ts"
export function createFakeZqd(port: number) {
  const responses: string[] = []
  const server = serve({port})

  respond(server, responses)

  return {
    respondWith(resp: string) {
      responses.push(resp)
    },
    close() {
      server.close()
    }
  }
}

async function respond(server: any, responses: string[]) {
  for await (const req of server) {
    req.respond({body: responses.shift()})
  }
}
