/* @flow */
import type {ReturnType} from "../types"
import zeekLogDescriptions from "../services/zeekLogDescriptions"

const specialUrls = {
  netcontrol_drop:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/netcontrol/drop.zeek.html",
  broker:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/broker/log.zeek.html",
  kerberos:
    "http://docs.zeek.org/en/stable/scripts/base/protocols/krb/main.zeek.html#type-KRB::Info",
  tunnel:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/tunnels/main.zeek.html#type-Tunnel::Info",
  reporter:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/reporter/main.zeek.html#type-Reporter::Info",
  x509:
    "http://docs.zeek.org/en/stable/scripts/base/files/x509/main.zeek.html#type-X509::Info",
  netcontrol_shunt:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/netcontrol/shunt.zeek.html#type-NetControl::ShuntInfo",
  dce_rpc:
    "http://docs.zeek.org/en/stable/scripts/base/protocols/dce-rpc/main.zeek.html#type-DCE_RPC::Info",
  smb_mapping:
    "http://docs.zeek.org/en/stable/scripts/base/protocols/smb/main.zeek.html#type-SMB::TreeInfo",
  signatures:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/signatures/main.zeek.html#type-Signatures::Info",
  openflow:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/openflow/plugins/log.zeek.html#type-OpenFlow::Info",
  pe:
    "http://docs.zeek.org/en/stable/scripts/base/files/pe/main.zeek.html#type-PE::Info",
  files:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/files/main.zeek.html#type-Files::Info",
  weird:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/notice/weird.zeek.html#type-Weird::Info",
  cluster:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/cluster/main.zeek.html#type-Cluster::Info",
  notice:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/notice/main.zeek.html#type-Notice::Info",
  notice_alarm:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/notice/main.zeek.html#type-Notice::Info",
  intel:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/intel/main.zeek.html#type-Intel::Info",
  dpd:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/dpd/main.zeek.html#type-DPD::Info",
  software:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/software/main.zeek.html#type-Software::Info",
  packet_filter:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/packet-filter/main.zeek.html#type-PacketFilter::Info",
  config:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/config/main.zeek.html#type-Config::Info",
  netcontrol:
    "http://docs.zeek.org/en/stable/scripts/base/frameworks/netcontrol/main.zeek.html#type-NetControl::Info",
  smb_files:
    "http://docs.zeek.org/en/stable/scripts/base/protocols/smb/main.zeek.html#type-SMB::FileInfo"
}

type ZeekLogInfoClass = ReturnType<typeof knownPath>
type ZeekInfo = {name: string, desc: string, type: string}[]

export default function zeekLogInfo(path: string): ZeekLogInfoClass {
  let key = `${path}_log`
  return key in zeekLogDescriptions
    ? knownPath(path, zeekLogDescriptions[key])
    : unknownPath()
}

function knownPath(path: string, info: ZeekInfo) {
  return {
    isKnown: () => {
      return true
    },
    docsUrl: () => {
      return path in specialUrls
        ? specialUrls[path]
        : `http://docs.zeek.org/en/stable/scripts/base/protocols/${path}/main.zeek.html`
    },
    describeColumn: (col: {name: string, type: string}) => {
      let firstPartOfName = col.name.split(".")[0]
      let field = info.find((f) => f.name === firstPartOfName) || {}
      return {
        desc: field.desc || "No description found.",
        type: field.type || col.type
      }
    }
  }
}

function unknownPath(): ZeekLogInfoClass {
  return {
    isKnown: () => false,
    docsUrl: () => "",
    describeColumn: (col: {name: string, type: string}) => ({
      desc: `No docs for ${col.name}.`,
      type: col.type
    })
  }
}
