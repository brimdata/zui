/* @flow */

export default {
  virusTotalUrl(value: string) {
    return "https://www.virustotal.com/gui/search/" + encodeURIComponent(value)
  }
}
