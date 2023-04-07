export default function whois(addr: string) {
  return global.zui.invoke("whoisOp", addr)
}
