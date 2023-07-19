import {invoke} from "src/core/invoke"

export default function whois(addr: string) {
  return invoke("whoisOp", addr)
}
