# Joining Data

- [Summary](#summary)
- [About Cookbooks](#about-cookbooks)
- [Limitations](#limitations)
- [Background: Brim & `zqd`](#background-brim--zqd)
- [Starting a Remote `zqd`](#starting-a-remote-zqd)
- [Importing Data](#importing-data)
- [Accessing Our Remote `zqd`](#accessing-our-remote-zqd)
- [Contact us!](#contact-us)

# Summary

While the out-of-the-box Zeek and Suricata data typically used in Brim is very
useful on its own, you may want to further enrich them with additional data
sources such as threat intelligence or domain/IP details. A common way to
leverage such multiple sources in data technologies is to "join" them together.

The Z language includes a `join` processor that can be used for this. The
processor is still new/experimental and represents the first of what will be
multiple ways of combining different data sources. This cookbook describes an
introductory use case that leverages the current `join` implementation while
discussing its limitations.

# About Cookbooks

Brim cookbooks provide an opportunity to "test drive" new/experimental
features in the Brim application and related [zq](https://github.com/brimsec/zq)
tools. They also walk through details of how Brim and zq tools function and
therefore may inspire other creative configurations.

All efforts are made to disclose known caveats and limitations that are
relevant to the configurations shown. However, due to the potential to
encounter bugs in evolving functionality, it is recommended that you initially
follow cookbooks in a non-production, lab-style setting. As such features
become more complete and stable, cookbooks may be retired and replaced with
regular [User Documentation](https://github.com/brimsec/brim/wiki#user-documentation).

Please report any bugs or usability issues you find when working with cookbooks
by [opening an issue](https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue)
or reaching out on the [Brim public Slack](https://www.brimsecurity.com/join-slack/).
We'd also love to hear your success stories and variations, so please don't be
shy!

# Limitations

Before diving into the specifics of what's possible, here's an overview of
some rough edges you may encounter as you work through the configurations
described in this article.

1. For those familiar with SQL, the current `join` implemention in Z can be
thought of a similar to a [left outer join](https://en.wikipedia.org/wiki/Join_(SQL)#Left_outer_join)
and hence applicable to use cases where that approach would apply.

2. The current `join` implementation is a _merge_-style join that relies on
each set of input records being sorted by the field being joined. The Z
processors referenced in this cookbook employ "spill-to-disk" functionality
that ensure they can perform the sort/join with arbitrarily large amounts of
data. However, we recognize the approach may not be as easy-to-use or as
performant as in-memory approaches that tools often take for smaller-scale
joins. We hope that user feedback will help us confirm which other approaches 
to joining we should offer next in future releases.

3. While the `join` processor is available in the Z language and hence
usable from within Brim, the Brim app currently lacks mechanisms to easily
unite and reference multiple diverse data sources in the same Space. While
these mechanisms are planned for future releases, the approach described in
this cookbook instead leverages the zq tools outside of Brim with the end result
being the creation of a [ZNG](https://github.com/brimsec/zq/tree/master/zng/docs)-format
log that can be imported into Brim if desired.

# Prepping tools & test data

For this cookbook, we've sought to employ a join-ready data source that
readers can access and follow along with. As many Brim users are already
familiar with [Zeek](https://zeek.org/), we've therefore opted to employ logs
from the Zeek package [SPL-SPT](https://github.com/micrictor/spl-spt), which
provides data about paylods in SSL-encrypted connections. The records produced
by the package include a `uid` value that could be joined to other well-known
Zeek record types that also include the `uid`, such as `ssl` or `conn`. This
would allow the SPL-SPT data to appear as additional columns on these records
as an alternative to pivoting between the separate logs streams.

As example input data, we'll use the same publicly-available pcap
[2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap.zip](https://www.malware-traffic-analysis.net/2020/09/02/2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap.zip)
that's used in the [Hunting Emotet with Brim and Zeek](https://medium.com/brim-securitys-knowledge-funnel/hunting-emotet-with-brim-and-zeek-1000c2f5c1ff)
blog article.

Finally, we'll use a standalone [Zeek v3.2.3](https://github.com/zeek/zeek/releases/tag/v3.2.3)
install to generate logs from our example pcap. Here we've started from a basic
[binary packages](https://github.com/zeek/zeek/wiki/Binary-Packages) install
on Linux. After also installing the
[Zeek Package Manager](https://docs.zeek.org/projects/package-manager/en/stable/quickstart.html),
adding the [SPL-SPT](https://github.com/micrictor/spl-spt) package is easy.

```
# zkg install --force https://github.com/micrictor/spl-spt
Installing "https://github.com/micrictor/spl-spt".
Installed "https://github.com/micrictor/spl-spt" (master)
Loaded "https://github.com/micrictor/spl-spt"
```

We unpack our test pcap (password: `infected`) and run it through Zeek to
generate logs.

```
$ unzip 2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap.zip 
Archive:  2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap.zip
[2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap.zip] 2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap password: 
  inflating: 2020-09-01-Emotet-epoch-3-infection-with-Trickbot-gtag-mor119.pcap

$ cat *.pcap | /opt/zeek/bin/zeek -C -r - spl-spt local

$ ls -l *.log
-rw-rw-r-- 1 phil phil   366 Jan 30 00:38 capture_loss.log
-rw-rw-r-- 1 phil phil 20095 Jan 30 00:38 conn.log
-rw-rw-r-- 1 phil phil 15082 Jan 30 00:38 dns.log
-rw-rw-r-- 1 phil phil   599 Jan 30 00:38 dpd.log
-rw-rw-r-- 1 phil phil 14955 Jan 30 00:38 files.log
-rw-rw-r-- 1 phil phil  6023 Jan 30 00:38 http.log
-rw-rw-r-- 1 phil phil 25744 Jan 30 00:38 loaded_scripts.log
-rw-rw-r-- 1 phil phil  1565 Jan 30 00:38 notice.log
-rw-rw-r-- 1 phil phil   254 Jan 30 00:38 packet_filter.log
-rw-rw-r-- 1 phil phil   566 Jan 30 00:38 pe.log
-rw-rw-r-- 1 phil phil  2818 Jan 30 00:38 spl.log
-rw-rw-r-- 1 phil phil  4891 Jan 30 00:38 ssl.log
-rw-rw-r-- 1 phil phil  1310 Jan 30 00:38 stats.log
-rw-rw-r-- 1 phil phil  1032 Jan 30 00:38 weird.log
-rw-rw-r-- 1 phil phil  5317 Jan 30 00:38 x509.log
```

# Joining Zeek SSL records with SPL-SPT data

The [SPL-SPT README](https://github.com/micrictor/spl-spt/blob/master/README.md)
explains that the tool operates on SSL connections. Looking inside the
`ssl.log` and `spl.log`, we can indeed see visually that the same `uid` values
appear in each, though not in our same order. This highlights the importance
of sorting by our `uid` join field.

```
$ cat ssl.log
#separator \x09
#set_separator	,
#empty_field	(empty)
#unset_field	-
#path	ssl
#open	2021-02-05-19-26-55
#fields	ts	uid	id.orig_h	id.orig_p	id.resp_h	id.resp_p	version	cipher	curve	server_name	resumed	last_alert	next_protocol	established	cert_chain_fuids	client_cert_chain_fuids	subject	issuer	client_subject	client_issuer	validation_status
#types	time	string	addr	port	addr	port	string	string	string	string	bool	string	string	bool	vector[string]	vector[string]	string	string	string	string	string
1598992773.193883	CRUIstLprtERqs8c8	10.9.1.101	49816	40.90.22.186	443	TLSv12	TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384	secp256r1	login.live.com	F	-	h2	T	Fxulet2GsFuEn0Uik4,FjJx5d2slh18Zneyg1	(empty)	CN=login.live.com,O=Microsoft Corporation,L=Redmond,ST=Washington,C=US	CN=DigiCert SHA2 Secure Server CA,O=DigiCert Inc,C=US	-	-	ok
1598992774.249073	COboho3mcULvz2l7yl	10.9.1.101	49819	52.158.208.111	443	TLSv12	TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256	x25519	watson.telemetry.microsoft.com	F	-	h2	T	FAl8Tn2Kndq0KjRLbc,F9VOZg1nhKg0R59mK4	(empty)	CN=*.big.telemetry.microsoft.com,OU=WSE,O=Microsoft,L=Redmond,ST=WA,C=US	CN=Microsoft Secure Server CA 2011,O=Microsoft Corporation,L=Redmond,ST=Washington,C=US	-	-	unable to get local issuer certificate
1598992776.460850	CN1TBv4cMtawH69YB5	10.9.1.101	49820	52.109.8.20	443	TLSv12	TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384	secp384r1	nexusrules.officeapps.live.com	F	-	-	T	Fol3JY2CZzUdiaczAh,Fj3y6C1sNWQCOFGPW6	(empty)	CN=nexusrules.officeapps.live.com	CN=Microsoft IT TLS CA 2,OU=Microsoft IT,O=Microsoft Corporation,L=Redmond,ST=Washington,C=US	-	-	ok
1598992772.249387	CUs6Sq3qciVfv4hbr7	10.9.1.101	49815	52.109.8.20	443	TLSv12	TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384	secp384r1	nexusrules.officeapps.live.com	F	-	-	F	FlOWnD1bpVKj8U6Dnf,FyfwGl3eDHc7yw2Nla	(empty)	-	-	-	-	ok
1598993440.318372	CDLhMi2tO58cin8BMg	10.9.1.101	49841	45.127.222.8	449	TLSv10	TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA	x25519	-	F	-	-	T	F6M76M2wDqQldrfIw4	(empty)	O=Internet Widgits Pty Ltd,ST=Some-State,C=AUO=Internet Widgits Pty Ltd,ST=Some-State,C=AU	-	-	self signed certificate
1598993441.496934	Ci7d2m2sQ358a9L6ej	10.9.1.101	49842	54.221.234.156	443	TLSv12	TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256	secp256r1	api.ipify.org	F	-	-	T	FZtbib3l8x1ystI3kj,FwcZye35MeWetibizd,FKUAIQ2DxCfmFQPU64	(empty)	CN=*.ipify.org,OU=PositiveSSL Wildcard,OU=Domain Control Validated	CN=COMODO RSA Domain Validation Secure Server CA,O=COMODO CA Limited,L=Salford,ST=Greater Manchester,C=GB	-	-	ok
1598993444.468059	CRjp3u3mrdzkKLXgfh	10.9.1.101	49843	62.108.35.9	447	TLSv12	TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384	secp256r1	-	F	-	-	T	Fi8GYS3h2Abx3EGXFd	(empty)	CN=example.com,OU=IT Department,O=Global Security,L=London,ST=London,C=GB	CN=example.com,OU=IT Department,O=Global Security,L=London,ST=London,C=GB	-	-	self signed certificate
...


$ cat spl.log
#separator \x09
#set_separator	,
#empty_field	(empty)
#unset_field	-
#path	spl
#open	2021-02-05-19-26-55
#fields	uid	orig_spl	resp_spl	orig_spt	resp_spt
#types	string	vector[count]	vector[count]	vector[double]	vector[double]
CUs6Sq3qciVfv4hbr7	96	-	0.0	-
COboho3mcULvz2l7yl	40,82,33,847,4129,925	40,64,33,50,50,50,37,747	0.0,0.010955,0.000084,0.000095,0.000525,0.00001	0.0,0.000582,0.044301,0.037286,0.0,0.000232,0.0,0.07704
CN1TBv4cMtawH69YB5	96,704	96,16464,16464,8752	0.0,0.003638	0.0,0.081352,0.035947,0.006567
CRUIstLprtERqs8c8	40,82,33,287,4715	40,64,33,50,50,37,11299,33	0.0,0.003105,0.000176,0.000275,0.00025	0.0,0.0,0.071305,0.066583,0.0,0.0,0.017593,0.0
Ci7d2m2sQ358a9L6ej	40,124,26	40,211,26	0.0,0.003581,0.00268	0.0,0.067068,59.334662
CRjp3u3mrdzkKLXgfh	40,191,195,26	40,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408,16408	0.0,0.001702,5.499787,65.32597	0.0,0.494461,0.101639,0.047581,0.128764,0.014464,0.138997,0.004323,0.003257,0.1347,0.003941,0.00431,0.079275,0.059136,0.010274,0.000965,0.005644,0.109902,0.023693,0.000138
Cwhpf01LpV4ChlWZ59	40,82,287,33,4689	40,64,33,50,50,37,11299,33	0.0,0.001331,0.000164,0.000101,0.000109	0.0,0.0,0.073435,0.066108,0.0,0.000109,0.014119,0.0
...
```

The following Z script can join these together by `uid`.

```
$ cat join-uid-ssl.zs 
split (
  => filter _path=ssl | sort uid
  => filter _path=spl | sort uid
) | join uid=uid orig_spl,resp_spl,orig_spt,resp_spt
```

As the name indicates, the `split` processor splits the input stream into
two separately-processed branches, with each branch marked by the `=>` inside
the parentheses. The `filter` processor used here on each branch explicitly
isolates the subset of events processed by each branch. After the `)` closes
the split, the multiple branches are _merged_ before `join` operates on them.

The syntax of `join` in brief is:

```
... | join left-key-expr=right-key-expr cut1,cut2,...
```

Where each `key-expr` is a Z [expression](https://github.com/brimsec/zq/blob/master/zql/docs/expressions/README.md)

2. 


# Contact us!

If you have questions or feedback about this cookbook, we'd like to hear from
you! Please join our [public Slack](https://www.brimsecurity.com/join-slack/) or
[open an issue](https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue). Thanks!
