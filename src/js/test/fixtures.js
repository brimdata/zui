/* @flow */

import Field from "../models/Field"
import Log from "../models/Log"

const FIXTURES = {
  logs: {
    conn1:
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:countorig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		0	conn	1425612054.369843	Cynwae4qh1GxM82hQ2	192.168.0.50	1900	239.255.255.250	1900	udp	-	2.000293	282	0	S0	-	-	0	D	3	366	0	0	(empty)",
    unsetDurationConn:
      "_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:count	orig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		conn	1428917684.727039	CgVEQNkcytYYMtmE5	192.168.0.51	5353	224.0.0.251	5353	udp	dns	-	-	-	S0	T	F	0	D	1	385	0	0	-",
    setDurationConn:
      "_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	proto:enum	service:string	duration:interval	orig_bytes:count	resp_bytes:count	conn_state:string	local_orig:bool	local_resp:bool	missed_bytes:count	history:string	orig_pkts:count	orig_ip_bytes:count	resp_pkts:count	resp_ip_bytes:count	tunnel_parents:set[string]		conn	1428917653.242511	CZusuU27VRdyfg5thj	192.168.0.51	138	192.168.0.255	138	udp	-	0.000031	474	0	S0	T	T	0	D	2	530	0	0	-",
    dhcp1:
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	mac:string	assigned_ip:addr	lease_time:interval	trans_id:count		1	dhcp	1425567029.996704	CrTPSI1Qb5sB8eBmm7	192.168.0.51	68	192.168.0.1	67	ec:f4:bb:4f:b2:45	192.168.0.51	86400.000000	4244918360",
    weird1:
      "_td:int	_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	name:string	addl:string	notice:bool	peer:string		12	weird	1425565544.849413	Cum4LVba3W3KNG6qa	fe80::eef4:bbff:fe51:89ec	5353	ff02::fb	5353	dns_unmatched_msg	-	F	bro",
    myBusinessDocHttp:
      "_path:string	ts:time	uid:string	id.orig_h:addr	id.orig_p:port	id.resp_h:addr	id.resp_p:port	trans_depth:count	method:string	host:string	uri:string	referrer:string	version:string	user_agent:string	request_body_len:count	response_body_len:count	status_code:count	status_msg:string	info_code:count	info_msg:string	tags:set[enum]	username:string	password:string	proxied:set[string]	orig_fuids:vector[string]	orig_filenames:vector[string]	orig_mime_types:vector[string] resp_fuids:vector[string]	resp_filenames:vector[string]	resp_mime_types:vector[string]		http	1428413684.244295	C9FG8S2NvxVUR0b0La	192.168.0.53	2210	68.164.182.11	80	1	GET	www.mybusinessdoc.com	/document.php?rnd=3271&id=5555525E01160D0F4A0C0E010809120D0F240309050D084A070B09	-	1.1	Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0)	0	318883	200	OK	-	-	(empty)-	-	-	-	-	-	FGx5ts2iCMfZSUgO8c	c87ed3c.gif	application/x-dosexec"
  },
  fields: {
    uid1: "uid:string\tCgVEQNkcytYYMtmE5",
    uid2: "uid:string\tCtd0Gv1XC3Z0UV1iX",
    uid3: "uid:string\tC9FG8S2NvxVUR0b0La",
    uid4: "uid:string\tCZusuU27VRdyfg5thj",
    conn: "_path:string\tconn",
    dhcp: "_path:string\tdhcp",
    weird: "_path:string\tweird",
    ts1: "ts:time\t1428917565.138847",
    ts2: "ts:time\t1428917684.727039"
  }
}

export default {
  log(name: string): Log {
    let string = FIXTURES.logs[name]
    if (string) {
      return Log.fromString(string)
    } else {
      throw new Error("Unkonwn log fixture: " + name)
    }
  },

  field(name: string): Field {
    let string = FIXTURES.fields[name]
    if (string) {
      return Field.fromString(string)
    } else {
      throw new Error("Unkonwn field fixture: " + name)
    }
  }
}
