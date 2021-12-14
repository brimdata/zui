import net from "net"

export function getPort(): Promise<number> {
  return new Promise((resolve) => {
    var server = net.createServer(function(sock) {
      sock.end("Hello world\n")
    })
    server.listen(0, function() {
      // @ts-ignore
      resolve(server.address().port)
      server.close()
    })
  })
}
