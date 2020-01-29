/* @flow */
export default {
  netcontrol_drop_log: [
    {
      name: "_path",
      type: "netcontrol_drop"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time at which the recorded activity occurred."
    },
    {
      name: "rule_id",
      type: "string",
      desc: "ID of the rule; unique during each Zeek run."
    },
    {
      name: "orig_h",
      type: "addr",
      desc: "The originator's IP address."
    },
    {
      name: "orig_p",
      type: "port",
      desc: "The originator's port number."
    },
    {
      name: "resp_h",
      type: "addr",
      desc: "The responder's IP address."
    },
    {
      name: "resp_p",
      type: "port",
      desc: "The responder's port number."
    },
    {
      name: "expire",
      type: "interval",
      desc: "Expiry time of the shunt."
    },
    {
      name: "location",
      type: "string",
      desc: "Location where the underlying action was triggered."
    }
  ],
  radius_log: [
    {
      name: "_path",
      type: "radius"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "username",
      type: "string",
      desc: "The username, if present."
    },
    {
      name: "mac",
      type: "string",
      desc: "MAC address, if present."
    },
    {
      name: "framed_addr",
      type: "addr",
      desc:
        "The address given to the network access server, if present.  This is only a hint from the RADIUS server and the network access server is not required to honor  the address."
    },
    {
      name: "tunnel_client",
      type: "string",
      desc:
        "Address (IPv4, IPv6, or FQDN) of the initiator end of the tunnel, if present.  This is collected from the Tunnel-Client-Endpoint attribute."
    },
    {
      name: "connect_info",
      type: "string",
      desc: "Connect info, if present."
    },
    {
      name: "reply_msg",
      type: "string",
      desc:
        "Reply message from the server challenge. This is  frequently shown to the user authenticating."
    },
    {
      name: "result",
      type: "string",
      desc: "Successful or failed authentication."
    },
    {
      name: "ttl",
      type: "interval",
      desc:
        'The duration between the first request and either the "Access-Accept" message or an error. If the field is empty, it means that either the request or response was not seen.'
    }
  ],
  software_log: [
    {
      name: "_path",
      type: "software"
    },
    {
      name: "ts",
      type: "time",
      desc: "The time at which the software was detected."
    },
    {
      name: "host",
      type: "addr",
      desc: "The IP address detected running the software."
    },
    {
      name: "host_p",
      type: "port",
      desc:
        "The port on which the software is running. Only sensible for server software."
    },
    {
      name: "software_type",
      type: "enum",
      desc: "The type of software detected (e.g. :zeek:enum:`HTTP::SERVER`)."
    },
    {
      name: "name",
      type: "string",
      desc: "Name of the software (e.g. Apache)."
    },
    {
      name: "version",
      type: "record Software::Version",
      desc: "Version of the software."
    },
    {
      name: "unparsed_version",
      type: "string",
      desc:
        "The full unparsed version string found because the version parsing doesn't always work reliably in all cases and this acts as a fallback in the logs."
    }
  ],
  ssh_log: [
    {
      name: "_path",
      type: "ssh"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the SSH connection began."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "version",
      type: "count",
      desc: "SSH major version (1 or 2)"
    },
    {
      name: "auth_success",
      type: "bool",
      desc: "Authentication result (T=success, F=failure, unset=unknown)"
    },
    {
      name: "auth_attempts",
      type: "count",
      desc:
        "The number of authentication attemps we observed. There's always at least one, since some servers might support no authentication at all. It's important to note that not all of these are failures, since some servers require two-factor auth (e.g. password AND pubkey)"
    },
    {
      name: "direction",
      type: "enum",
      desc:
        "Direction of the connection. If the client was a local host logging into an external host, this would be OUTBOUND. INBOUND would be set for the opposite situation."
    },
    {
      name: "client",
      type: "string",
      desc: "The client's version string"
    },
    {
      name: "server",
      type: "string",
      desc: "The server's version string"
    },
    {
      name: "cipher_alg",
      type: "string",
      desc: "The encryption algorithm in use"
    },
    {
      name: "mac_alg",
      type: "string",
      desc: "The signing (MAC) algorithm in use"
    },
    {
      name: "compression_alg",
      type: "string",
      desc: "The compression algorithm in use"
    },
    {
      name: "kex_alg",
      type: "string",
      desc: "The key exchange algorithm in use"
    },
    {
      name: "host_key_alg",
      type: "string",
      desc: "The server host key's algorithm"
    },
    {
      name: "host_key",
      type: "string",
      desc: "The server's key fingerprint"
    }
  ],
  files_log: [
    {
      name: "_path",
      type: "files"
    },
    {
      name: "ts",
      type: "time",
      desc: "The time when the file was first seen."
    },
    {
      name: "fuid",
      type: "string",
      desc: "An identifier associated with a single file."
    },
    {
      name: "tx_hosts",
      type: "table",
      desc:
        "If this file was transferred over a network connection this should show the host or hosts that the data sourced from."
    },
    {
      name: "rx_hosts",
      type: "table",
      desc:
        "If this file was transferred over a network connection this should show the host or hosts that the data traveled to."
    },
    {
      name: "conn_uids",
      type: "table",
      desc: "Connection UIDs over which the file was transferred."
    },
    {
      name: "source",
      type: "string",
      desc:
        "An identification of the source of the file data.  E.g. it may be a network protocol over which it was transferred, or a local file path which was read, or some other input source."
    },
    {
      name: "depth",
      type: "count",
      desc:
        "A value to represent the depth of this file in relation to its source.  In SMTP, it is the depth of the MIME attachment on the message.  In HTTP, it is the depth of the request within the TCP connection."
    },
    {
      name: "analyzers",
      type: "table",
      desc: "A set of analysis types done during the file analysis."
    },
    {
      name: "mime_type",
      type: "string",
      desc:
        "A mime type provided by the strongest file magic signature match against the *bof_buffer* field of :zeek:see:`fa_file`, or in the cases where no buffering of the beginning of file occurs, an initial guess of the mime type based on the first data seen."
    },
    {
      name: "filename",
      type: "string",
      desc:
        'A filename for the file if one is available from the source for the file.  These will frequently come from "Content-Disposition" headers in network protocols.'
    },
    {
      name: "duration",
      type: "interval",
      desc: "The duration the file was analyzed for."
    },
    {
      name: "local_orig",
      type: "bool",
      desc:
        "If the source of this file is a network connection, this field indicates if the data originated from the local network or not as determined by the configured :zeek:see:`Site::local_nets`."
    },
    {
      name: "is_orig",
      type: "bool",
      desc:
        "If the source of this file is a network connection, this field indicates if the file is being sent by the originator of the connection or the responder."
    },
    {
      name: "seen_bytes",
      type: "count",
      desc: "Number of bytes provided to the file analysis engine for the file."
    },
    {
      name: "total_bytes",
      type: "count",
      desc: "Total number of bytes that are supposed to comprise the full file."
    },
    {
      name: "missing_bytes",
      type: "count",
      desc:
        "The number of bytes in the file stream that were completely missed during the process of analysis e.g. due to dropped packets."
    },
    {
      name: "overflow_bytes",
      type: "count",
      desc:
        "The number of bytes in the file stream that were not delivered to stream file analyzers.  This could be overlapping bytes or  bytes that couldn't be reassembled."
    },
    {
      name: "timedout",
      type: "bool",
      desc: "Whether the file analysis timed out at least once for the file."
    },
    {
      name: "parent_fuid",
      type: "string",
      desc:
        "Identifier associated with a container file from which this one was extracted as part of the file analysis."
    },
    {
      name: "md5",
      type: "string",
      desc: "An MD5 digest of the file contents."
    },
    {
      name: "sha1",
      type: "string",
      desc: "A SHA1 digest of the file contents."
    },
    {
      name: "sha256",
      type: "string",
      desc: "A SHA256 digest of the file contents."
    },
    {
      name: "extracted",
      type: "string",
      desc: "Local filename of extracted file."
    },
    {
      name: "extracted_cutoff",
      type: "bool",
      desc:
        "Set to true if the file being extracted was cut off so the whole file was not logged."
    },
    {
      name: "extracted_size",
      type: "count",
      desc: "The number of bytes extracted to disk."
    }
  ],
  http_log: [
    {
      name: "_path",
      type: "http"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the request happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "trans_depth",
      type: "count",
      desc:
        "Represents the pipelined depth into the connection of this request/response transaction."
    },
    {
      name: "method",
      type: "string",
      desc: "Verb used in the HTTP request (GET, POST, HEAD, etc.)."
    },
    {
      name: "host",
      type: "string",
      desc: "Value of the HOST header."
    },
    {
      name: "uri",
      type: "string",
      desc: "URI used in the request."
    },
    {
      name: "referrer",
      type: "string",
      desc:
        'Value of the "referer" header.  The comment is deliberately misspelled like the standard declares, but the name used here is "referrer" spelled correctly.'
    },
    {
      name: "version",
      type: "string",
      desc: "Value of the version portion of the request."
    },
    {
      name: "user_agent",
      type: "string",
      desc: "Value of the User-Agent header from the client."
    },
    {
      name: "origin",
      type: "string",
      desc: "Value of the Origin header from the client."
    },
    {
      name: "request_body_len",
      type: "count",
      desc:
        "Actual uncompressed content size of the data transferred from the client."
    },
    {
      name: "response_body_len",
      type: "count",
      desc:
        "Actual uncompressed content size of the data transferred from the server."
    },
    {
      name: "status_code",
      type: "count",
      desc: "Status code returned by the server."
    },
    {
      name: "status_msg",
      type: "string",
      desc: "Status message returned by the server."
    },
    {
      name: "info_code",
      type: "count",
      desc: "Last seen 1xx informational reply code returned by the server."
    },
    {
      name: "info_msg",
      type: "string",
      desc: "Last seen 1xx informational reply message returned by the server."
    },
    {
      name: "tags",
      type: "table",
      desc:
        "A set of indicators of various attributes discovered and related to a particular request/response pair."
    },
    {
      name: "username",
      type: "string",
      desc: "Username if basic-auth is performed for the request."
    },
    {
      name: "password",
      type: "string",
      desc: "Password if basic-auth is performed for the request."
    },
    {
      name: "proxied",
      type: "table",
      desc: "All of the headers that may indicate if the request was proxied."
    },
    {
      name: "orig_fuids",
      type: "vector",
      desc:
        "An ordered vector of file unique IDs. Limited to :zeek:see:`HTTP::max_files_orig` entries."
    },
    {
      name: "orig_filenames",
      type: "vector",
      desc:
        "An ordered vector of filenames from the client. Limited to :zeek:see:`HTTP::max_files_orig` entries."
    },
    {
      name: "orig_mime_types",
      type: "vector",
      desc:
        "An ordered vector of mime types. Limited to :zeek:see:`HTTP::max_files_orig` entries."
    },
    {
      name: "resp_fuids",
      type: "vector",
      desc:
        "An ordered vector of file unique IDs. Limited to :zeek:see:`HTTP::max_files_resp` entries."
    },
    {
      name: "resp_filenames",
      type: "vector",
      desc:
        "An ordered vector of filenames from the server. Limited to :zeek:see:`HTTP::max_files_resp` entries."
    },
    {
      name: "resp_mime_types",
      type: "vector",
      desc:
        "An ordered vector of mime types. Limited to :zeek:see:`HTTP::max_files_resp` entries."
    }
  ],
  kerberos_log: [
    {
      name: "_path",
      type: "kerberos"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "request_type",
      type: "string",
      desc:
        'Request type - Authentication Service ("AS") or Ticket Granting Service ("TGS")'
    },
    {
      name: "client",
      type: "string",
      desc: "Client"
    },
    {
      name: "service",
      type: "string",
      desc: "Service"
    },
    {
      name: "success",
      type: "bool",
      desc: "Request result"
    },
    {
      name: "error_msg",
      type: "string",
      desc: "Error message"
    },
    {
      name: "from",
      type: "time",
      desc: "Ticket valid from"
    },
    {
      name: "till",
      type: "time",
      desc: "Ticket valid till"
    },
    {
      name: "cipher",
      type: "string",
      desc: "Ticket encryption type"
    },
    {
      name: "forwardable",
      type: "bool",
      desc: "Forwardable ticket requested"
    },
    {
      name: "renewable",
      type: "bool",
      desc: "Renewable ticket requested"
    },
    {
      name: "client_cert_subject",
      type: "string",
      desc: "Subject of client certificate, if any"
    },
    {
      name: "client_cert_fuid",
      type: "string",
      desc: "File unique ID of client cert, if any"
    },
    {
      name: "server_cert_subject",
      type: "string",
      desc: "Subject of server certificate, if any"
    },
    {
      name: "server_cert_fuid",
      type: "string",
      desc: "File unique ID of server cert, if any"
    }
  ],
  mysql_log: [
    {
      name: "_path",
      type: "mysql"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "cmd",
      type: "string",
      desc: "The command that was issued"
    },
    {
      name: "arg",
      type: "string",
      desc: "The argument issued to the command"
    },
    {
      name: "success",
      type: "bool",
      desc: "Did the server tell us that the command succeeded?"
    },
    {
      name: "rows",
      type: "count",
      desc: "The number of affected rows, if any"
    },
    {
      name: "response",
      type: "string",
      desc: "Server message, if any"
    }
  ],
  ntlm_log: [
    {
      name: "_path",
      type: "ntlm"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "username",
      type: "string",
      desc: "Username given by the client."
    },
    {
      name: "hostname",
      type: "string",
      desc: "Hostname given by the client."
    },
    {
      name: "domainname",
      type: "string",
      desc: "Domainname given by the client."
    },
    {
      name: "server_nb_computer_name",
      type: "string",
      desc: "NetBIOS name given by the server in a CHALLENGE."
    },
    {
      name: "server_dns_computer_name",
      type: "string",
      desc: "DNS name given by the server in a CHALLENGE."
    },
    {
      name: "server_tree_name",
      type: "string",
      desc: "Tree name given by the server in a CHALLENGE."
    },
    {
      name: "success",
      type: "bool",
      desc: "Indicate whether or not the authentication was successful."
    }
  ],
  pe_log: [
    {
      name: "_path",
      type: "pe"
    },
    {
      name: "ts",
      type: "time",
      desc: "Current timestamp."
    },
    {
      name: "id",
      type: "string",
      desc: "File id of this portable executable file."
    },
    {
      name: "machine",
      type: "string",
      desc: "The target machine that the file was compiled for."
    },
    {
      name: "compile_ts",
      type: "time",
      desc: "The time that the file was created at."
    },
    {
      name: "os",
      type: "string",
      desc: "The required operating system."
    },
    {
      name: "subsystem",
      type: "string",
      desc: "The subsystem that is required to run this file."
    },
    {
      name: "is_exe",
      type: "bool",
      desc: "Is the file an executable, or just an object file?"
    },
    {
      name: "is_64bit",
      type: "bool",
      desc: "Is the file a 64-bit executable?"
    },
    {
      name: "uses_aslr",
      type: "bool",
      desc: "Does the file support Address Space Layout Randomization?"
    },
    {
      name: "uses_dep",
      type: "bool",
      desc: "Does the file support Data Execution Prevention?"
    },
    {
      name: "uses_code_integrity",
      type: "bool",
      desc: "Does the file enforce code integrity checks?"
    },
    {
      name: "uses_seh",
      type: "bool",
      desc: "Does the file use structured exception handing?"
    },
    {
      name: "has_import_table",
      type: "bool",
      desc: "Does the file have an import table?"
    },
    {
      name: "has_export_table",
      type: "bool",
      desc: "Does the file have an export table?"
    },
    {
      name: "has_cert_table",
      type: "bool",
      desc: "Does the file have an attribute certificate table?"
    },
    {
      name: "has_debug_data",
      type: "bool",
      desc: "Does the file have a debug table?"
    },
    {
      name: "section_names",
      type: "vector",
      desc: "The names of the sections, in order."
    }
  ],
  signatures_log: [
    {
      name: "_path",
      type: "signatures"
    },
    {
      name: "ts",
      type: "time",
      desc:
        "The network time at which a signature matching type of event to be logged has occurred."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "A unique identifier of the connection which triggered the signature match event."
    },
    {
      name: "src_addr",
      type: "addr",
      desc: "The host which triggered the signature match event."
    },
    {
      name: "src_port",
      type: "port",
      desc: "The host port on which the signature-matching activity occurred."
    },
    {
      name: "dst_addr",
      type: "addr",
      desc:
        "The destination host which was sent the payload that triggered the signature match."
    },
    {
      name: "dst_port",
      type: "port",
      desc:
        "The destination host port which was sent the payload that triggered the signature match."
    },
    {
      name: "note",
      type: "enum",
      desc: "Notice associated with signature event."
    },
    {
      name: "sig_id",
      type: "string",
      desc: "The name of the signature that matched."
    },
    {
      name: "event_msg",
      type: "string",
      desc: "A more descriptive message of the signature-matching event."
    },
    {
      name: "sub_msg",
      type: "string",
      desc: "Extracted payload data or extra message."
    },
    {
      name: "sig_count",
      type: "count",
      desc: "Number of sigs, usually from summary count."
    },
    {
      name: "host_count",
      type: "count",
      desc: "Number of hosts, from a summary count."
    }
  ],
  ssl_log: [
    {
      name: "_path",
      type: "ssl"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the SSL connection was first detected."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "version",
      type: "string",
      desc: "SSL/TLS version that the server chose."
    },
    {
      name: "cipher",
      type: "string",
      desc: "SSL/TLS cipher suite that the server chose."
    },
    {
      name: "curve",
      type: "string",
      desc: "Elliptic curve the server chose when using ECDH/ECDHE."
    },
    {
      name: "server_name",
      type: "string",
      desc:
        "Value of the Server Name Indicator SSL/TLS extension.  It indicates the server name that the client was requesting."
    },
    {
      name: "resumed",
      type: "bool",
      desc:
        "Flag to indicate if the session was resumed reusing the key material exchanged in an earlier connection."
    },
    {
      name: "last_alert",
      type: "string",
      desc: "Last alert that was seen during the connection."
    },
    {
      name: "next_protocol",
      type: "string",
      desc:
        "Next protocol the server chose using the application layer next protocol extension, if present."
    },
    {
      name: "established",
      type: "bool",
      desc:
        "Flag to indicate if this ssl session has been established successfully, or if it was aborted during the handshake."
    },
    {
      name: "cert_chain_fuids",
      type: "vector",
      desc:
        "An ordered vector of all certificate file unique IDs for the certificates offered by the server."
    },
    {
      name: "client_cert_chain_fuids",
      type: "vector",
      desc:
        "An ordered vector of all certificate file unique IDs for the certificates offered by the client."
    },
    {
      name: "subject",
      type: "string",
      desc: "Subject of the X.509 certificate offered by the server."
    },
    {
      name: "issuer",
      type: "string",
      desc:
        "Subject of the signer of the X.509 certificate offered by the server."
    },
    {
      name: "client_subject",
      type: "string",
      desc: "Subject of the X.509 certificate offered by the client."
    },
    {
      name: "client_issuer",
      type: "string",
      desc:
        "Subject of the signer of the X.509 certificate offered by the client."
    }
  ],
  intel_log: [
    {
      name: "_path",
      type: "intel"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp when the data was discovered."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "If a connection was associated with this intelligence hit, this is the uid for the connection"
    },
    {
      name: "id",
      type: "record conn_id",
      desc:
        "If a connection was associated with this intelligence hit, this is the conn_id for the connection."
    },
    {
      name: "seen",
      type: "record Intel::Seen",
      desc: "Where the data was seen."
    },
    {
      name: "matched",
      type: "table",
      desc: "Which indicator types matched."
    },
    {
      name: "sources",
      type: "table",
      desc: "Sources which supplied data that resulted in this match."
    },
    {
      name: "fuid",
      type: "string",
      desc:
        "If a file was associated with this intelligence hit, this is the uid for the file."
    },
    {
      name: "file_mime_type",
      type: "string",
      desc:
        "A mime type if the intelligence hit is related to a file. If the $f field is provided this will be automatically filled out."
    },
    {
      name: "file_desc",
      type: "string",
      desc:
        'Frequently files can be "described" to give a bit more context. If the $f field is provided this field will be automatically filled out.'
    }
  ],
  openflow_log: [
    {
      name: "_path",
      type: "openflow"
    },
    {
      name: "ts",
      type: "time",
      desc: "Network time."
    },
    {
      name: "dpid",
      type: "count",
      desc: "OpenFlow switch datapath id."
    },
    {
      name: "match",
      type: "record OpenFlow::ofp_match",
      desc: "OpenFlow match fields."
    },
    {
      name: "flow_mod",
      type: "record OpenFlow::ofp_flow_mod",
      desc: "OpenFlow modify flow entry message."
    }
  ],
  modbus_log: [
    {
      name: "_path",
      type: "modbus"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time of the request."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique identifier for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "Identifier for the connection."
    },
    {
      name: "func",
      type: "string",
      desc: "The name of the function message that was sent."
    },
    {
      name: "exception",
      type: "string",
      desc: "The exception if the response was a failure."
    }
  ],
  rdp_log: [
    {
      name: "_path",
      type: "rdp"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "cookie",
      type: "string",
      desc:
        "Cookie value used by the client machine. This is typically a username."
    },
    {
      name: "result",
      type: "string",
      desc:
        "Status result for the connection.  It's a mix between RDP negotation failure messages and GCC server create response messages."
    },
    {
      name: "security_protocol",
      type: "string",
      desc: "Security protocol chosen by the server."
    },
    {
      name: "client_channels",
      type: "vector",
      desc: "The channels requested by the client"
    },
    {
      name: "keyboard_layout",
      type: "string",
      desc: "Keyboard layout (language) of the client machine."
    },
    {
      name: "client_build",
      type: "string",
      desc: "RDP client version used by the client machine."
    },
    {
      name: "client_name",
      type: "string",
      desc: "Name of the client machine."
    },
    {
      name: "client_dig_product_id",
      type: "string",
      desc: "Product ID of the client machine."
    },
    {
      name: "desktop_width",
      type: "count",
      desc: "Desktop width of the client machine."
    },
    {
      name: "desktop_height",
      type: "count",
      desc: "Desktop height of the client machine."
    },
    {
      name: "requested_color_depth",
      type: "string",
      desc:
        "The color depth requested by the client in  the high_color_depth field."
    },
    {
      name: "cert_type",
      type: "string",
      desc:
        "If the connection is being encrypted with native RDP encryption, this is the type of cert  being used."
    },
    {
      name: "cert_count",
      type: "count",
      desc:
        "The number of certs seen.  X.509 can transfer an  entire certificate chain."
    },
    {
      name: "cert_permanent",
      type: "bool",
      desc:
        "Indicates if the provided certificate or certificate chain is permanent or temporary."
    },
    {
      name: "encryption_level",
      type: "string",
      desc: "Encryption level of the connection."
    },
    {
      name: "encryption_method",
      type: "string",
      desc: "Encryption method of the connection. "
    }
  ],
  smb_files_log: [
    {
      name: "_path",
      type: "smb_files"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the file was first discovered."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID of the connection the file was sent over."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "ID of the connection the file was sent over."
    },
    {
      name: "fuid",
      type: "string",
      desc: "Unique ID of the file."
    },
    {
      name: "action",
      type: "enum",
      desc: "Action this log record represents."
    },
    {
      name: "path",
      type: "string",
      desc: "Path pulled from the tree this file was transferred to or from."
    },
    {
      name: "name",
      type: "string",
      desc: "Filename if one was seen."
    },
    {
      name: "size",
      type: "count",
      desc: "Total size of the file."
    },
    {
      name: "prev_name",
      type: "string",
      desc:
        "If the rename action was seen, this will be the file's previous name."
    },
    {
      name: "times",
      type: "record SMB::MACTimes",
      desc: "Last time this file was modified."
    }
  ],
  snmp_log: [
    {
      name: "_path",
      type: "snmp"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp of first packet belonging to the SNMP session."
    },
    {
      name: "uid",
      type: "string",
      desc: "The unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc:
        "The connection's 5-tuple of addresses/ports (ports inherently include transport protocol information)"
    },
    {
      name: "duration",
      type: "interval",
      desc:
        "The amount of time between the first packet beloning to the SNMP session and the latest one seen."
    },
    {
      name: "version",
      type: "string",
      desc: "The version of SNMP being used."
    },
    {
      name: "community",
      type: "string",
      desc:
        "The community string of the first SNMP packet associated with the session.  This is used as part of SNMP's (v1 and v2c) administrative/security framework.  See :rfc:`1157` or :rfc:`1901`."
    },
    {
      name: "get_requests",
      type: "count",
      desc:
        "The number of variable bindings in GetRequest/GetNextRequest PDUs seen for the session."
    },
    {
      name: "get_bulk_requests",
      type: "count",
      desc:
        "The number of variable bindings in GetBulkRequest PDUs seen for the session."
    },
    {
      name: "get_responses",
      type: "count",
      desc:
        "The number of variable bindings in GetResponse/Response PDUs seen for the session."
    },
    {
      name: "set_requests",
      type: "count",
      desc:
        "The number of variable bindings in SetRequest PDUs seen for the session."
    },
    {
      name: "display_string",
      type: "string",
      desc: "A system description of the SNMP responder endpoint."
    },
    {
      name: "up_since",
      type: "time",
      desc:
        "The time at which the SNMP responder endpoint claims it's been up since."
    }
  ],
  broker_log: [
    {
      name: "_path",
      type: "broker"
    },
    {
      name: "ts",
      type: "time",
      desc: "The network time at which a Broker event occurred."
    },
    {
      name: "ty",
      type: "enum",
      desc: "The type of the Broker event."
    },
    {
      name: "ev",
      type: "string",
      desc: "The event being logged."
    },
    {
      name: "peer",
      type: "record Broker::NetworkInfo",
      desc: "The peer (if any) with which a Broker event is concerned."
    },
    {
      name: "message",
      type: "string",
      desc: "An optional message describing the Broker event in more detail"
    }
  ],
  smb_mapping_log: [
    {
      name: "_path",
      type: "smb_mapping"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the tree was mapped."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID of the connection the tree was mapped over."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "ID of the connection the tree was mapped over."
    },
    {
      name: "path",
      type: "string",
      desc: "Name of the tree path."
    },
    {
      name: "service",
      type: "string",
      desc:
        "The type of resource of the tree (disk share, printer share, named pipe, etc.)."
    },
    {
      name: "native_file_system",
      type: "string",
      desc: "File system of the tree."
    },
    {
      name: "share_type",
      type: "string",
      desc:
        "If this is SMB2, a share type will be included.  For SMB1, the type of share will be deduced and included as well."
    }
  ],
  config_log: [
    {
      name: "_path",
      type: "config"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp at which the configuration change occured."
    },
    {
      name: "id",
      type: "string",
      desc: "ID of the value that was changed."
    },
    {
      name: "old_value",
      type: "string",
      desc: "Value before the change."
    },
    {
      name: "new_value",
      type: "string",
      desc: "Value after the change."
    },
    {
      name: "location",
      type: "string",
      desc: "Optional location that triggered the change."
    }
  ],
  ftp_log: [
    {
      name: "_path",
      type: "ftp"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the command was sent."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "user",
      type: "string",
      desc: "User name for the current FTP session."
    },
    {
      name: "password",
      type: "string",
      desc: "Password for the current FTP session if captured."
    },
    {
      name: "command",
      type: "string",
      desc: "Command given by the client."
    },
    {
      name: "arg",
      type: "string",
      desc: "Argument for the command if one is given."
    },
    {
      name: "mime_type",
      type: "string",
      desc: "Sniffed mime type of file."
    },
    {
      name: "file_size",
      type: "count",
      desc: "Size of the file if the command indicates a file transfer."
    },
    {
      name: "reply_code",
      type: "count",
      desc: "Reply code from the server in response to the command."
    },
    {
      name: "reply_msg",
      type: "string",
      desc: "Reply message from the server in response to the command."
    },
    {
      name: "data_channel",
      type: "record FTP::ExpectedDataChannel",
      desc: "Expected FTP data channel."
    },
    {
      name: "fuid",
      type: "string",
      desc: "File unique ID."
    }
  ],
  dhcp_log: [
    {
      name: "_path",
      type: "dhcp"
    },
    {
      name: "ts",
      type: "time",
      desc:
        "The earliest time at which a DHCP message over the associated connection is observed."
    },
    {
      name: "uids",
      type: "table",
      desc:
        "A series of unique identifiers of the connections over which DHCP is occurring.  This behavior with multiple connections is unique to DHCP because of the way it uses broadcast packets on local networks."
    },
    {
      name: "client_addr",
      type: "addr",
      desc:
        "IP address of the client.  If a transaction is only a client sending INFORM messages then there is no lease information exchanged so this is helpful to know who sent the messages. Getting an address in this field does require that the client sources at least one DHCP message using a non-broadcast address."
    },
    {
      name: "server_addr",
      type: "addr",
      desc:
        "IP address of the server involved in actually handing out the lease.  There could be other servers replying with OFFER messages which won't be represented here.  Getting an address in this field also requires that the server handing out the lease also sources packets from a non-broadcast IP address."
    },
    {
      name: "mac",
      type: "string",
      desc: "Client's hardware address."
    },
    {
      name: "host_name",
      type: "string",
      desc: "Name given by client in Hostname option 12."
    },
    {
      name: "client_fqdn",
      type: "string",
      desc: "FQDN given by client in Client FQDN option 81."
    },
    {
      name: "domain",
      type: "string",
      desc: "Domain given by the server in option 15."
    },
    {
      name: "requested_addr",
      type: "addr",
      desc: "IP address requested by the client."
    },
    {
      name: "assigned_addr",
      type: "addr",
      desc: "IP address assigned by the server."
    },
    {
      name: "lease_time",
      type: "interval",
      desc: "IP address lease interval."
    },
    {
      name: "client_message",
      type: "string",
      desc:
        "Message typically accompanied with a DHCP_DECLINE so the client can tell the server why it rejected an address."
    },
    {
      name: "server_message",
      type: "string",
      desc:
        "Message typically accompanied with a DHCP_NAK to let the client know why it rejected the request."
    },
    {
      name: "msg_types",
      type: "vector",
      desc: "The DHCP message types seen by this DHCP transaction"
    },
    {
      name: "duration",
      type: "interval",
      desc:
        'Duration of the DHCP "session" representing the  time from the first message to the last.'
    }
  ],
  dpd_log: [
    {
      name: "_path",
      type: "dpd"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when protocol analysis failed."
    },
    {
      name: "uid",
      type: "string",
      desc: "Connection unique ID."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "Connection ID containing the 4-tuple which identifies endpoints."
    },
    {
      name: "proto",
      type: "enum",
      desc: "Transport protocol for the violation."
    },
    {
      name: "analyzer",
      type: "string",
      desc: "The analyzer that generated the violation."
    },
    {
      name: "failure_reason",
      type: "string",
      desc: "The textual reason for the analysis failure."
    }
  ],
  notice_log: [
    {
      name: "_path",
      type: "notice"
    },
    {
      name: "ts",
      type: "time",
      desc:
        "An absolute time indicating when the notice occurred, defaults to the current network time."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "A connection UID which uniquely identifies the endpoints concerned with the notice."
    },
    {
      name: "id",
      type: "record conn_id",
      desc:
        "A connection 4-tuple identifying the endpoints concerned with the notice."
    },
    {
      name: "fuid",
      type: "string",
      desc:
        "A file unique ID if this notice is related to a file.  If the *f* field is provided, this will be automatically filled out."
    },
    {
      name: "file_mime_type",
      type: "string",
      desc:
        "A mime type if the notice is related to a file.  If the *f* field is provided, this will be automatically filled out."
    },
    {
      name: "file_desc",
      type: "string",
      desc:
        'Frequently files can be "described" to give a bit more context.  This field will typically be automatically filled out from an fa_file record.  For example, if a notice was related to a file over HTTP, the URL of the request would be shown.'
    },
    {
      name: "proto",
      type: "enum",
      desc:
        "The transport protocol. Filled automatically when either *conn*, *iconn* or *p* is specified."
    },
    {
      name: "note",
      type: "enum",
      desc: "The :zeek:type:`Notice::Type` of the notice."
    },
    {
      name: "msg",
      type: "string",
      desc: "The human readable message for the notice."
    },
    {
      name: "sub",
      type: "string",
      desc: "The human readable sub-message."
    },
    {
      name: "src",
      type: "addr",
      desc: "Source address, if we don't have a :zeek:type:`conn_id`."
    },
    {
      name: "dst",
      type: "addr",
      desc: "Destination address."
    },
    {
      name: "p",
      type: "port",
      desc: "Associated port, if we don't have a :zeek:type:`conn_id`."
    },
    {
      name: "n",
      type: "count",
      desc: "Associated count, or perhaps a status code."
    },
    {
      name: "peer_descr",
      type: "string",
      desc:
        "Textual description for the peer that raised this notice, including name, host address and port."
    },
    {
      name: "actions",
      type: "table",
      desc: "The actions which have been applied to this notice."
    },
    {
      name: "suppress_for",
      type: "interval",
      desc:
        "This field indicates the length of time that this unique notice should be suppressed."
    },
    {
      name: "remote_location",
      type: "record geo_location",
      desc:
        "If GeoIP support is built in, notices can have geographic information attached to them."
    }
  ],
  weird_log: [
    {
      name: "_path",
      type: "weird"
    },
    {
      name: "ts",
      type: "time",
      desc: "The time when the weird occurred."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "If a connection is associated with this weird, this will be the connection's unique ID."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "conn_id for the optional connection."
    },
    {
      name: "name",
      type: "string",
      desc: "The name of the weird that occurred."
    },
    {
      name: "addl",
      type: "string",
      desc: "Additional information accompanying the weird if any."
    },
    {
      name: "notice",
      type: "bool",
      desc: "Indicate if this weird was also turned into a notice."
    },
    {
      name: "peer",
      type: "string",
      desc:
        "The peer that originated this weird.  This is helpful in cluster deployments if a particular cluster node is having trouble to help identify which node is having trouble."
    }
  ],
  netcontrol_shunt_log: [
    {
      name: "_path",
      type: "netcontrol_shunt"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time at which the recorded activity occurred."
    },
    {
      name: "rule_id",
      type: "string",
      desc: "ID of the rule; unique during each Zeek run."
    },
    {
      name: "f",
      type: "record flow_id",
      desc: "Flow ID of the shunted flow."
    },
    {
      name: "expire",
      type: "interval",
      desc: "Expiry time of the shunt."
    },
    {
      name: "location",
      type: "string",
      desc: "Location where the underlying action was triggered."
    }
  ],
  reporter_log: [
    {
      name: "_path",
      type: "reporter"
    },
    {
      name: "ts",
      type: "time",
      desc: "The network time at which the reporter event was generated."
    },
    {
      name: "level",
      type: "enum",
      desc:
        "The severity of the reporter message. Levels are INFO for informational messages, not needing specific attention; WARNING for warning of a potential problem, and ERROR for a non-fatal error that should be addressed, but doesn't terminate program execution."
    },
    {
      name: "message",
      type: "string",
      desc:
        "An info/warning/error message that could have either been generated from the internal Zeek core or at the scripting-layer."
    },
    {
      name: "location",
      type: "string",
      desc:
        "This is the location in a Zeek script where the message originated. Not all reporter messages will have locations in them though."
    }
  ],
  tunnel_log: [
    {
      name: "_path",
      type: "tunnel"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time at which some tunnel activity occurred."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "The unique identifier for the tunnel, which may correspond to a :zeek:type:`connection`'s *uid* field for non-IP-in-IP tunnels. This is optional because there could be numerous connections for payload proxies like SOCKS but we should treat it as a single tunnel."
    },
    {
      name: "id",
      type: "record conn_id",
      desc:
        'The tunnel "connection" 4-tuple of endpoint addresses/ports. For an IP tunnel, the ports will be 0.'
    },
    {
      name: "tunnel_type",
      type: "enum",
      desc: "The type of tunnel."
    },
    {
      name: "action",
      type: "enum",
      desc: "The type of activity that occurred."
    }
  ],
  dnp3_log: [
    {
      name: "_path",
      type: "dnp3"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time of the request."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique identifier for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "Identifier for the connection."
    },
    {
      name: "fc_request",
      type: "string",
      desc: "The name of the function message in the request."
    },
    {
      name: "fc_reply",
      type: "string",
      desc: "The name of the function message in the reply."
    },
    {
      name: "iin",
      type: "count",
      desc: 'The response\'s "internal indication number".'
    }
  ],
  netcontrol_log: [
    {
      name: "_path",
      type: "netcontrol"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time at which the recorded activity occurred."
    },
    {
      name: "rule_id",
      type: "string",
      desc: "ID of the rule; unique during each Zeek run."
    },
    {
      name: "category",
      type: "enum",
      desc: "Type of the log entry."
    },
    {
      name: "cmd",
      type: "string",
      desc: "The command the log entry is about."
    },
    {
      name: "state",
      type: "enum",
      desc: "State the log entry reflects."
    },
    {
      name: "action",
      type: "string",
      desc: "String describing an action the entry is about."
    },
    {
      name: "target",
      type: "enum",
      desc: "The target type of the action."
    },
    {
      name: "entity_type",
      type: "string",
      desc: "Type of the entity the log entry is about."
    },
    {
      name: "entity",
      type: "string",
      desc: "String describing the entity the log entry is about."
    },
    {
      name: "mod",
      type: "string",
      desc:
        "String describing the optional modification of the entry (e.h. redirect)"
    },
    {
      name: "msg",
      type: "string",
      desc: "String with an additional message."
    },
    {
      name: "priority",
      type: "int",
      desc: "Number describing the priority of the log entry."
    },
    {
      name: "expire",
      type: "interval",
      desc: "Expiry time of the log entry."
    },
    {
      name: "location",
      type: "string",
      desc: "Location where the underlying action was triggered."
    },
    {
      name: "plugin",
      type: "string",
      desc: "Plugin triggering the log entry."
    }
  ],
  notice_alarm_log: [
    {
      name: "_path",
      type: "notice_alarm"
    },
    {
      name: "ts",
      type: "time",
      desc:
        "An absolute time indicating when the notice occurred, defaults to the current network time."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "A connection UID which uniquely identifies the endpoints concerned with the notice."
    },
    {
      name: "id",
      type: "record conn_id",
      desc:
        "A connection 4-tuple identifying the endpoints concerned with the notice."
    },
    {
      name: "fuid",
      type: "string",
      desc:
        "A file unique ID if this notice is related to a file.  If the *f* field is provided, this will be automatically filled out."
    },
    {
      name: "file_mime_type",
      type: "string",
      desc:
        "A mime type if the notice is related to a file.  If the *f* field is provided, this will be automatically filled out."
    },
    {
      name: "file_desc",
      type: "string",
      desc:
        'Frequently files can be "described" to give a bit more context.  This field will typically be automatically filled out from an fa_file record.  For example, if a notice was related to a file over HTTP, the URL of the request would be shown.'
    },
    {
      name: "proto",
      type: "enum",
      desc:
        "The transport protocol. Filled automatically when either *conn*, *iconn* or *p* is specified."
    },
    {
      name: "note",
      type: "enum",
      desc: "The :zeek:type:`Notice::Type` of the notice."
    },
    {
      name: "msg",
      type: "string",
      desc: "The human readable message for the notice."
    },
    {
      name: "sub",
      type: "string",
      desc: "The human readable sub-message."
    },
    {
      name: "src",
      type: "addr",
      desc: "Source address, if we don't have a :zeek:type:`conn_id`."
    },
    {
      name: "dst",
      type: "addr",
      desc: "Destination address."
    },
    {
      name: "p",
      type: "port",
      desc: "Associated port, if we don't have a :zeek:type:`conn_id`."
    },
    {
      name: "n",
      type: "count",
      desc: "Associated count, or perhaps a status code."
    },
    {
      name: "peer_descr",
      type: "string",
      desc:
        "Textual description for the peer that raised this notice, including name, host address and port."
    },
    {
      name: "actions",
      type: "table",
      desc: "The actions which have been applied to this notice."
    },
    {
      name: "suppress_for",
      type: "interval",
      desc:
        "This field indicates the length of time that this unique notice should be suppressed."
    },
    {
      name: "remote_location",
      type: "record geo_location",
      desc:
        "If GeoIP support is built in, notices can have geographic information attached to them."
    }
  ],
  conn_log: [
    {
      name: "_path",
      type: "conn"
    },
    {
      name: "ts",
      type: "time",
      desc: "This is the time of the first packet."
    },
    {
      name: "uid",
      type: "string",
      desc: "A unique identifier of the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "proto",
      type: "enum",
      desc: "The transport layer protocol of the connection."
    },
    {
      name: "service",
      type: "string",
      desc:
        "An identification of an application protocol being sent over the connection."
    },
    {
      name: "duration",
      type: "interval",
      desc:
        "How long the connection lasted.  For 3-way or 4-way connection tear-downs, this will not include the final ACK."
    },
    {
      name: "orig_bytes",
      type: "count",
      desc:
        "The number of payload bytes the originator sent. For TCP this is taken from sequence numbers and might be inaccurate (e.g., due to large connections)."
    },
    {
      name: "resp_bytes",
      type: "count",
      desc: "The number of payload bytes the responder sent. See *orig_bytes*."
    },
    {
      name: "conn_state",
      type: "string",
      desc: `Possible *conn_state* values:

* S0: Connection attempt seen, no reply.
* S1: Connection established, not terminated.
* SF: Normal establishment and termination.   Note that this is the same symbol as for state S1.   You can tell the two apart because for S1 there will not be any   byte counts in the summary, while for SF there will be.
* REJ: Connection attempt rejected.
* S2: Connection established and close attempt by originator seen   (but no reply from responder).
* S3: Connection established and close attempt by responder seen   (but no reply from originator).
* RSTO: Connection established, originator aborted (sent a RST).
* RSTR: Responder sent a RST.
* RSTOS0: Originator sent a SYN followed by a RST, we never saw a   SYN-ACK from the responder.
* RSTRH: Responder sent a SYN ACK followed by a RST, we never saw a   SYN from the (purported) originator.
* SH: Originator sent a SYN followed by a FIN, we never saw a   SYN ACK from the responder (hence the connection was "half" open).
* SHR: Responder sent a SYN ACK followed by a FIN, we never saw a   SYN from the originator.
* OTH: No SYN seen, just midstream traffic (a "partial connection"   that was not later closed).`
    },
    {
      name: "local_orig",
      type: "bool",
      desc:
        "If the connection is originated locally, this value will be T. If it was originated remotely it will be F.  In the case that the :zeek:id:`Site::local_nets` variable is undefined, this field will be left empty at all times."
    },
    {
      name: "local_resp",
      type: "bool",
      desc:
        "If the connection is responded to locally, this value will be T. If it was responded to remotely it will be F.  In the case that the :zeek:id:`Site::local_nets` variable is undefined, this field will be left empty at all times."
    },
    {
      name: "missed_bytes",
      type: "count",
      desc:
        "Indicates the number of bytes missed in content gaps, which is representative of packet loss.  A value other than zero will normally cause protocol analysis to fail but some analysis may have been completed prior to the packet loss."
    },
    {
      name: "history",
      type: "string",
      desc: `Records the state history of connections as a string of letters.  The meaning of those letters is:

* "s": a SYN w/o the ACK bit set
* "h": a SYN+ACK ("handshake")
* "a": a pure ACK
* "d": packet with payload ("data")
* "f": packet with FIN bit set
* "r": packet with RST bit set
* "c": packet with a bad checksum (applies to UDP too)
* "g": a content gap
* "t": packet with retransmitted payload
* "w": packet with a zero window advertisement
* "i": inconsistent packet (e.g. FIN+RST bits set)
* "q": multi-flag packet (SYN+FIN or SYN+RST bits set)
* "^": connection direction was flipped by Zeek's heuristic

If the event comes from the originator, the letter is in upper-case; if it comes from the responder, it's in lower-case.  The 'a', 'd', 'i' and 'q' flags are recorded a maximum of one time in either direction regardless of how many are actually seen.  'f', 'h', 'r' and 's' can be recorded multiple times for either direction if the associated sequence number differs from the last-seen packet of the same flag type. 'c', 'g', 't' and 'w' are recorded in a logarithmic fashion: the second instance represents that the event was seen (at least) 10 times; the third instance, 100 times; etc.`
    },
    {
      name: "orig_pkts",
      type: "count",
      desc:
        "Number of packets that the originator sent. Only set if :zeek:id:`use_conn_size_analyzer` = T."
    },
    {
      name: "orig_ip_bytes",
      type: "count",
      desc:
        "Number of IP level bytes that the originator sent (as seen on the wire, taken from the IP total_length header field). Only set if :zeek:id:`use_conn_size_analyzer` = T."
    },
    {
      name: "resp_pkts",
      type: "count",
      desc:
        "Number of packets that the responder sent. Only set if :zeek:id:`use_conn_size_analyzer` = T."
    },
    {
      name: "resp_ip_bytes",
      type: "count",
      desc:
        "Number of IP level bytes that the responder sent (as seen on the wire, taken from the IP total_length header field). Only set if :zeek:id:`use_conn_size_analyzer` = T."
    },
    {
      name: "tunnel_parents",
      type: "table",
      desc:
        "If this connection was over a tunnel, indicate the *uid* values for any encapsulating parent connections used over the lifetime of this inner connection."
    }
  ],
  dns_log: [
    {
      name: "_path",
      type: "dns"
    },
    {
      name: "ts",
      type: "time",
      desc:
        "The earliest time at which a DNS protocol message over the associated connection is observed."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "A unique identifier of the connection over which DNS messages are being transferred."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "proto",
      type: "enum",
      desc: "The transport layer protocol of the connection."
    },
    {
      name: "trans_id",
      type: "count",
      desc:
        "A 16-bit identifier assigned by the program that generated the DNS query.  Also used in responses to match up replies to outstanding queries."
    },
    {
      name: "rtt",
      type: "interval",
      desc:
        "Round trip time for the query and response. This indicates the delay between when the request was seen until the answer started."
    },
    {
      name: "query",
      type: "string",
      desc: "The domain name that is the subject of the DNS query."
    },
    {
      name: "qclass",
      type: "count",
      desc: "The QCLASS value specifying the class of the query."
    },
    {
      name: "qclass_name",
      type: "string",
      desc: "A descriptive name for the class of the query."
    },
    {
      name: "qtype",
      type: "count",
      desc: "A QTYPE value specifying the type of the query."
    },
    {
      name: "qtype_name",
      type: "string",
      desc: "A descriptive name for the type of the query."
    },
    {
      name: "rcode",
      type: "count",
      desc: "The response code value in DNS response messages."
    },
    {
      name: "rcode_name",
      type: "string",
      desc: "A descriptive name for the response code value."
    },
    {
      name: "AA",
      type: "bool",
      desc:
        "The Authoritative Answer bit for response messages specifies that the responding name server is an authority for the domain name in the question section."
    },
    {
      name: "TC",
      type: "bool",
      desc: "The Truncation bit specifies that the message was truncated."
    },
    {
      name: "RD",
      type: "bool",
      desc:
        "The Recursion Desired bit in a request message indicates that the client wants recursive service for this query."
    },
    {
      name: "RA",
      type: "bool",
      desc:
        "The Recursion Available bit in a response message indicates that the name server supports recursive queries."
    },
    {
      name: "Z",
      type: "count",
      desc: "A reserved field that is usually zero in queries and responses."
    },
    {
      name: "answers",
      type: "vector",
      desc: "The set of resource descriptions in the query answer."
    },
    {
      name: "TTLs",
      type: "vector",
      desc:
        "The caching intervals of the associated RRs described by the *answers* field."
    },
    {
      name: "rejected",
      type: "bool",
      desc: "The DNS query was rejected by the server."
    }
  ],
  smtp_log: [
    {
      name: "_path",
      type: "smtp"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the message was first seen."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "trans_depth",
      type: "count",
      desc:
        "A count to represent the depth of this message transaction in a single connection where multiple messages were transferred."
    },
    {
      name: "helo",
      type: "string",
      desc: "Contents of the Helo header."
    },
    {
      name: "mailfrom",
      type: "string",
      desc: "Email addresses found in the From header."
    },
    {
      name: "rcptto",
      type: "table",
      desc: "Email addresses found in the Rcpt header."
    },
    {
      name: "date",
      type: "string",
      desc: "Contents of the Date header."
    },
    {
      name: "from",
      type: "string",
      desc: "Contents of the From header."
    },
    {
      name: "to",
      type: "table",
      desc: "Contents of the To header."
    },
    {
      name: "cc",
      type: "table",
      desc: "Contents of the CC header."
    },
    {
      name: "reply_to",
      type: "string",
      desc: "Contents of the ReplyTo header."
    },
    {
      name: "msg_id",
      type: "string",
      desc: "Contents of the MsgID header."
    },
    {
      name: "in_reply_to",
      type: "string",
      desc: "Contents of the In-Reply-To header."
    },
    {
      name: "subject",
      type: "string",
      desc: "Contents of the Subject header."
    },
    {
      name: "x_originating_ip",
      type: "addr",
      desc: "Contents of the X-Originating-IP header."
    },
    {
      name: "first_received",
      type: "string",
      desc: "Contents of the first Received header."
    },
    {
      name: "second_received",
      type: "string",
      desc: "Contents of the second Received header."
    },
    {
      name: "last_reply",
      type: "string",
      desc: "The last message that the server sent to the client."
    },
    {
      name: "path",
      type: "vector",
      desc: "The message transmission path, as extracted from the headers."
    },
    {
      name: "user_agent",
      type: "string",
      desc: "Value of the User-Agent header from the client."
    },
    {
      name: "tls",
      type: "bool",
      desc: "Indicates that the connection has switched to using TLS."
    },
    {
      name: "fuids",
      type: "vector",
      desc: "An ordered vector of file unique IDs seen attached to the message."
    }
  ],
  socks_log: [
    {
      name: "_path",
      type: "socks"
    },
    {
      name: "ts",
      type: "time",
      desc: "Time when the proxy connection was first detected."
    },
    {
      name: "uid",
      type: "string",
      desc:
        "Unique ID for the tunnel - may correspond to connection uid or be non-existent."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "version",
      type: "count",
      desc: "Protocol version of SOCKS."
    },
    {
      name: "user",
      type: "string",
      desc: "Username used to request a login to the proxy."
    },
    {
      name: "password",
      type: "string",
      desc: "Password used to request a login to the proxy."
    },
    {
      name: "status",
      type: "string",
      desc: "Server status for the attempt at using the proxy."
    },
    {
      name: "request",
      type: "record SOCKS::Address",
      desc:
        "Client requested SOCKS address. Could be an address, a name or both."
    },
    {
      name: "request_p",
      type: "port",
      desc: "Client requested port."
    },
    {
      name: "bound",
      type: "record SOCKS::Address",
      desc: "Server bound address. Could be an address, a name or both."
    },
    {
      name: "bound_p",
      type: "port",
      desc: "Server bound port."
    }
  ],
  syslog_log: [
    {
      name: "_path",
      type: "syslog"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp when the syslog message was seen."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "proto",
      type: "enum",
      desc: "Protocol over which the message was seen."
    },
    {
      name: "facility",
      type: "string",
      desc: "Syslog facility for the message."
    },
    {
      name: "severity",
      type: "string",
      desc: "Syslog severity for the message."
    },
    {
      name: "message",
      type: "string",
      desc: "The plain text message."
    }
  ],
  irc_log: [
    {
      name: "_path",
      type: "irc"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp when the command was seen."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "nick",
      type: "string",
      desc: "Nickname given for the connection."
    },
    {
      name: "user",
      type: "string",
      desc: "Username given for the connection."
    },
    {
      name: "command",
      type: "string",
      desc: "Command given by the client."
    },
    {
      name: "value",
      type: "string",
      desc: "Value for the command given by the client."
    },
    {
      name: "addl",
      type: "string",
      desc: "Any additional data for the command."
    },
    {
      name: "dcc_file_name",
      type: "string",
      desc: "DCC filename requested."
    },
    {
      name: "dcc_file_size",
      type: "count",
      desc: "Size of the DCC transfer as indicated by the sender."
    },
    {
      name: "dcc_mime_type",
      type: "string",
      desc: "Sniffed mime type of the file."
    },
    {
      name: "fuid",
      type: "string",
      desc: "File unique ID."
    }
  ],
  sip_log: [
    {
      name: "_path",
      type: "sip"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the request happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "trans_depth",
      type: "count",
      desc:
        "Represents the pipelined depth into the connection of this request/response transaction."
    },
    {
      name: "method",
      type: "string",
      desc: "Verb used in the SIP request (INVITE, REGISTER etc.)."
    },
    {
      name: "uri",
      type: "string",
      desc: "URI used in the request."
    },
    {
      name: "date",
      type: "string",
      desc: "Contents of the Date: header from the client"
    },
    {
      name: "request_from",
      type: "string",
      desc:
        "Contents of the request From: header Note: The tag= value that's usually appended to the sender is stripped off and not logged."
    },
    {
      name: "request_to",
      type: "string",
      desc: "Contents of the To: header"
    },
    {
      name: "response_from",
      type: "string",
      desc:
        "Contents of the response From: header Note: The ``tag=`` value that's usually appended to the sender is stripped off and not logged."
    },
    {
      name: "response_to",
      type: "string",
      desc: "Contents of the response To: header"
    },
    {
      name: "reply_to",
      type: "string",
      desc: "Contents of the Reply-To: header"
    },
    {
      name: "call_id",
      type: "string",
      desc: "Contents of the Call-ID: header from the client"
    },
    {
      name: "seq",
      type: "string",
      desc: "Contents of the CSeq: header from the client"
    },
    {
      name: "subject",
      type: "string",
      desc: "Contents of the Subject: header from the client"
    },
    {
      name: "request_path",
      type: "vector",
      desc:
        "The client message transmission path, as extracted from the headers."
    },
    {
      name: "response_path",
      type: "vector",
      desc:
        "The server message transmission path, as extracted from the headers."
    },
    {
      name: "user_agent",
      type: "string",
      desc: "Contents of the User-Agent: header from the client"
    },
    {
      name: "status_code",
      type: "count",
      desc: "Status code returned by the server."
    },
    {
      name: "status_msg",
      type: "string",
      desc: "Status message returned by the server."
    },
    {
      name: "warning",
      type: "string",
      desc: "Contents of the Warning: header"
    },
    {
      name: "request_body_len",
      type: "count",
      desc: "Contents of the Content-Length: header from the client"
    },
    {
      name: "response_body_len",
      type: "count",
      desc: "Contents of the Content-Length: header from the server"
    },
    {
      name: "content_type",
      type: "string",
      desc: "Contents of the Content-Type: header from the server"
    }
  ],
  packet_filter_log: [
    {
      name: "_path",
      type: "packet_filter"
    },
    {
      name: "ts",
      type: "time",
      desc: "The time at which the packet filter installation attempt was made."
    },
    {
      name: "node",
      type: "string",
      desc:
        "This is a string representation of the node that applied this packet filter.  It's mostly useful in the context of dynamically changing filters on clusters."
    },
    {
      name: "filter",
      type: "string",
      desc: "The packet filter that is being set."
    },
    {
      name: "init",
      type: "bool",
      desc: "Indicate if this is the filter set during initialization."
    },
    {
      name: "success",
      type: "bool",
      desc: "Indicate if the filter was applied successfully."
    }
  ],
  x509_log: [
    {
      name: "_path",
      type: "x509"
    },
    {
      name: "ts",
      type: "time",
      desc: "Current timestamp."
    },
    {
      name: "id",
      type: "string",
      desc: "File id of this certificate."
    },
    {
      name: "certificate",
      type: "record X509::Certificate",
      desc: "Basic information about the certificate."
    },
    {
      name: "san",
      type: "record X509::SubjectAlternativeName",
      desc: "Subject alternative name extension of the certificate."
    },
    {
      name: "basic_constraints",
      type: "record X509::BasicConstraints",
      desc: "Basic constraints extension of the certificate."
    }
  ],
  cluster_log: [
    {
      name: "_path",
      type: "cluster"
    },
    {
      name: "ts",
      type: "time",
      desc: "The time at which a cluster message was generated."
    },
    {
      name: "node",
      type: "string",
      desc: "The name of the node that is creating the log record."
    },
    {
      name: "message",
      type: "string",
      desc: "A message indicating information about the cluster's operation."
    }
  ],
  dce_rpc_log: [
    {
      name: "_path",
      type: "dce_rpc"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "rtt",
      type: "interval",
      desc:
        "Round trip time from the request to the response. If either the request or response wasn't seen,  this will be null."
    },
    {
      name: "named_pipe",
      type: "string",
      desc: "Remote pipe name."
    },
    {
      name: "endpoint",
      type: "string",
      desc: "Endpoint name looked up from the uuid."
    },
    {
      name: "operation",
      type: "string",
      desc: "Operation seen in the call."
    }
  ],
  rfb_log: [
    {
      name: "_path",
      type: "rfb"
    },
    {
      name: "ts",
      type: "time",
      desc: "Timestamp for when the event happened."
    },
    {
      name: "uid",
      type: "string",
      desc: "Unique ID for the connection."
    },
    {
      name: "id",
      type: "record conn_id",
      desc: "The connection's 4-tuple of endpoint addresses/ports."
    },
    {
      name: "client_major_version",
      type: "string",
      desc: "Major version of the client."
    },
    {
      name: "client_minor_version",
      type: "string",
      desc: "Minor version of the client."
    },
    {
      name: "server_major_version",
      type: "string",
      desc: "Major version of the server."
    },
    {
      name: "server_minor_version",
      type: "string",
      desc: "Minor version of the server."
    },
    {
      name: "authentication_method",
      type: "string",
      desc: "Identifier of authentication method used."
    },
    {
      name: "auth",
      type: "bool",
      desc: "Whether or not authentication was successful."
    },
    {
      name: "share_flag",
      type: "bool",
      desc: "Whether the client has an exclusive or a shared session."
    },
    {
      name: "desktop_name",
      type: "string",
      desc: "Name of the screen that is being shared."
    },
    {
      name: "width",
      type: "count",
      desc: "Width of the screen that is being shared."
    },
    {
      name: "height",
      type: "count",
      desc: "Height of the screen that is being shared."
    }
  ]
}
