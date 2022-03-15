# Joining Data

- [Summary](#summary)
- [About Cookbooks](#about-cookbooks)
- [Example Usage](#example-usage)
- [Contact us!](#contact-us)

# Summary

Similar to the well-known [SQL construct](<https://en.wikipedia.org/wiki/Join_(SQL)>),
the Zed language provides a `join` operator that can be used to combine data
sources. This cookbook describes how it can be used with the Brim application
and discusses its limitations.

# About Cookbooks

Brim cookbooks provide an opportunity to "test drive" new/experimental
features in the Brim application and related [Zed](https://github.com/brimdata/zed)
tools. They also walk through details of how Brim and Zed tools function and
therefore may inspire other creative configurations.

All efforts are made to disclose known caveats and limitations that are
relevant to the configurations shown. However, due to the potential to
encounter bugs in evolving functionality, it is recommended that you initially
follow cookbooks in a non-production, lab-style setting. As such features
become more complete and stable, cookbooks may be retired and replaced with
regular [User Documentation](https://github.com/brimdata/brim/wiki#user-documentation).

Please report any bugs or usability issues you find when working with cookbooks
by [opening an issue](https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue)
or reaching out on the [Brim public Slack](https://www.brimdata.io/join-slack/).
We'd also love to hear your success stories and variations, so please don't be
shy!

# Example Usage

By its nature, a join operation requires two inputs that will
ultimately be combined. The Zed [`join` docs](https://github.com/brimdata/zed/tree/main/docs/zq/operators/join.md)
show examples with the [Zed CLI tools](https://github.com/brimdata/zed#quick-start)
that specify these inputs as named files or pools in a [Zed Lake](https://github.com/brimdata/zed/blob/main/docs/zed/README.md).

The `join` operator is still experimental and has somewhat hard-to-use syntax,
though this should be improved soon in a subsequent release.
The easiest way to join data within Brim is to join two subsets of data
from the same pool using `switch` to define the parent streams for
input into the join.

In this example, `fruit.ndjson` and `people.ndjson` are already present in a
single pool (such as if concatenated into a single file and dragged into the
app), and we can see the same query output as shown in the doc:

![Streamed Join Example](media/Join-Streamed.png)

> **Note:** Because the data being displayed is of multiple different shapes,
> Brim's **Columns** setting has been modified here to set **Headers: On**.

While queries executed from inside Brim are subject to this limitation, the
Zed backend that's launched behind Brim is not. Therefore if you're willing to
perform joins in the shell using [`zed`](https://github.com/brimdata/zed#quick-start)
you can execute all the other examples shown while accessing data from multiple
pools. The joined results can be sent into yet another pool for further query
from within Brim, if desired.

To illustrate this, we'll walk through the [example that shows inputs from pools](https://github.com/brimdata/zed/blob/main/docs/zq/operators/from.md).
To ensure API-compatibility with the Zed backend, we'll use the `zed` binary
found in the `zdeps` directory under the Brim [application binaries](https://github.com/brimdata/brim/wiki/Filesystem-Paths#application-binaries-v0250)
path, specifically on macOS in this case.

Because Brim already takes care of initializing the Zed Lake, we pick up the
example commands with the creation and population of the separate pools

```bash
$ export PATH="/Applications/Brim.app/Contents/Resources/app.asar.unpacked/zdeps:$PATH"
# Setting ZED_LAKE is optional as http://localhost:9867 is the default.
$ export ZED_LAKE="http://localhost:9867"

$ zed create -orderby flavor:asc fruit
pool created: fruit 1xu7lTnMF7n3TcT3Rg3ivZ0Q9N3

$ zed create -orderby likes:asc people
pool created: people 1xu7nejkZEysqneOCcBhhkgkbrO

$ zed load -use fruit@main fruit.ndjson
1ujTdNNId0s6TmVKd02lFRuwzN2 committed

$ zed load -use people@main people.ndjson
1ujTeU44ZbqdE5x6DvMoTwSkztS committed
```

Finally, we'll use `zed query` to perform the `join` using the example Zed
script, but we'll pipe its output to a `zed load` that populates a new pool
we've created to hold the result. Depending on the nature of the queries you
intend to execute on the data in this pool, you may wish to specify a different
`-orderby` setting.

```bash
$ zed create -orderby name:asc joined
pool created: joined

$ zed query -I inner-join-pools.zed | zed load -use joined@main -
1ujUTZvk5KyAoGlSMSGvzFcUGgy committed
```

As the name indicates, the `split` operator _splits_ the input stream into
two separately-processed branches, with each branch marked by the `=>` inside
the parentheses. The `filter` operator used here on each branch explicitly
isolates the subset of events processed by each branch. After the `)` closes
the split, the multiple branches are _merged_ back into a single stream before
`join` operates on them.

The first argument to `join` is a Zed
[expression](https://github.com/brimdata/zed/blob/main/docs/zq/language.md#6-expressions)
that references fields in the respective left/right data sources to determine
if a pair of records from each should be joined. In this case, since the field
we're joining on is named `uid` in both data sources, the simple expression
`uid=uid` suffices. The next argument is a comma-separated list of field names
or assignments, similar to how the
[`cut`](https://github.com/brimdata/zed/tree/main/docs/zq/operators/cut.md)
operator is used.

To apply this using `zq`, we employ its `-P` option that allows us to specify
two or more parallel inputs, with each input being wired up in order to each
branch in our `split`.

```
$ zq -z join-uid-ssl.zs -P ssl.log spl.log > ssl-plus-spl.zng
```

If we import this ZNG into Brim, we can see the additional fields are now
included in the `ssl` events.

![Joined Zeek SSL events](media/Joined-Zeek-SSL.png)

This has shown us the "happy path" for data that's best suited for working
with the `join` operator in its current implementation. The following sections
describe some variations where additional Zed concepts may be applied to
achieve ideal joins and data presentation.

## Alternate Schemas For Non-Matches

Our test data produced Zeek logs that had a 1-to-1 pairing between 24 Zeek
`ssl` events and 24 `spl` events that described them. However, our experience
would have been different if our left-hand data source had contained
records with `uid` values that did match any records in our right-side `spl`
data source.

Using the logs we've already generated, we can see the effects of this by
instead using the Zeek `conn` records as our left-hand data source, since there
are many non-SSL flows that would have bypassed the SPL-SPT package.

```
$ cat join-uid-conn.zs
split (
  => filter _path=conn | sort uid
  => filter _path=spl | sort uid
) | join uid=uid orig_spl,resp_spl,orig_spt,resp_spt

$ zq -z join-uid-conn.zs -P conn.log spl.log > conn-plus-spl.zng
```

Once again we can import this ZNG into Brim and see how it looks.

![Joined Zeek conn events](media/Joined-Zeek-conn.png)

If you click on individual events, you will see that the `join` successfully
added the additional SPL-SPT fields to `conn` events that had a matching `uid`
and not to others.

![Joined Zeek conn events compared](media/Join-Zeek-conn-comparison.png)

However, if we look closely at our prior screenshot that showed the initial
splash of all `conn` events, we see something curious. Normally in Brim, if
we're viewing only one Zeek log type, we're accustomed to seeing the data
laid out in columns with headers. However, this did not occur with our joined
ZNG data.

To understand why, it helps to look at our two example `conn` records in
[ZSON](https://github.com/brimdata/zed/blob/main/docs/formats/zson.md) format.

```
$ zq -f zson 'id.orig_p=49885 or id.orig_p=54470' conn-plus-spl.zng
{
    _path: "conn",
    ts: 2020-09-01T21:09:54.901635Z,
    uid: "CGFVvl3LGf6Bw3lZBa",
    id: {
        orig_h: 10.9.1.101,
        orig_p: 54470 (port=(uint16)),
        resp_h: 10.9.1.1,
        resp_p: 53 (port)
    } (=0),
    proto: "udp" (=zenum),
    service: "dns",
    duration: 49.816ms,
    orig_bytes: 48 (uint64),
    resp_bytes: 157 (uint64),
    conn_state: "SF",
    local_orig: null (bool),
    local_resp: null (bool),
    missed_bytes: 0 (uint64),
    history: "Dd",
    orig_pkts: 1 (uint64),
    orig_ip_bytes: 76 (uint64),
    resp_pkts: 1 (uint64),
    resp_ip_bytes: 185 (uint64),
    tunnel_parents: null (1=(|[string]|))
} (=2)
{
    _path: "conn",
    ts: 2020-09-01T21:09:54.95248Z,
    uid: "Ch7yQn3PwSMC1WcdC5",
    id: {
        orig_h: 10.9.1.101,
        orig_p: 49885,
        resp_h: 52.114.158.50,
        resp_p: 443
    } (0),
    proto: "tcp" (zenum),
    service: "ssl",
    duration: 376.681ms,
    orig_bytes: 3031 (uint64),
    resp_bytes: 6552 (uint64),
    conn_state: "S1",
    local_orig: null (bool),
    local_resp: null (bool),
    missed_bytes: 0 (uint64),
    history: "ShADad",
    orig_pkts: 13 (uint64),
    orig_ip_bytes: 3563 (uint64),
    resp_pkts: 14 (uint64),
    resp_ip_bytes: 7116 (uint64),
    tunnel_parents: null (1),
    orig_spl: [
        40 (uint64),
        853 (uint64),
        1846 (uint64)
    ] (=3),
    resp_spl: [
        40,
        49,
        352
    ] (3),
    orig_spt: [
        0e+00,
        1.511e-03,
        1.3e-04
    ] (=4),
    resp_spt: [
        0e+00,
        7.2188e-02,
        6.3113e-02
    ] (4)
} (=5)
```

The presence of the separate
[Type Definitions](https://github.com/brimdata/zed/blob/main/docs/formats/zson.md#25-types)
`(=2)` and `(=5)` shows us how separate schemas were generated for the two
record variations produced by the `join`: The ones that matched on `uid` (and
hence contained the additional SPL-SPT fields) and the ones that didn't.
Meanwhile, Brim's ability to automatically populate column headers is
predicated on query results all falling under a single schema, since the
headers need to reflect all fields expected in the output.

Now that we're recognized this, we can make a small change to our Zed to address
it. By adding the [`fuse`](https://github.com/brimdata/zed/tree/main/docs/zq/operators/fuse.md)
operator, we can ensure all the data is captured under a single, unified
schema.

```
$ cat join-uid-conn-fused.zs
split (
  => filter _path=conn | sort uid
  => filter _path=spl | sort uid
) | join uid=uid orig_spl,resp_spl,orig_spt,resp_spt | fuse

$ zq -z join-uid-conn-fused.zs -P conn.log spl.log > conn-plus-spl-fused.zng
```

Now when the ZNG is loaded into Brim, we immediately see the column headers
and can "scroll right" to confirm the SPL-SPT fields are where we expect to see
them.

![Joined Zeek conn events (fused)](media/Joined-Zeek-conn-fused.png)

If we compare our two example events side-by-side again, we see a subtle
difference from what we saw in the non-fused ZNG: Now the SPL-SPT fields on the
non-matching `conn` events _are_ present, but they're populated with explicit
`null` values.

![Joined Zeek conn events compared](media/Join-Zeek-conn-fused-comparison.png)

Both this approach and the non-fused one showed earlier are technically
accurate representations of the data, but you may prefer one over the other
depending on your use case.

## Records Lacking a Join Key

In the examples shown thus far, we've worked with individual Zeek log files
that each contain only a single Zeek event type. However, most Brim users are
accustomed to dragging pcaps into the app, which generates a single,
time-sorted log that can be exported into a single ZNG file via Brim's
**Export** button. If you use `zq` to examine such a ZNG file in ZSON format,
you'll see more instances of what we saw earlier with Type Definitions for
different diverse schemas, in this case one per Zeek event type.

Let's assume we've followed the [Zeek Customization](https://github.com/brimdata/brim/wiki/Zeek-Customization)
article to point our Brim at a customized Zeek that includes the SPL-SPT
package. After having imported our test pcap to Brim and extracted the ZNG as
a file `results.zng`, let's look at a count of the different Zeek event types we
find.

```
$ zq -f table 'count() by _path | sort -r' results.zng
_PATH        COUNT
conn         168
dns          99
files        57
http         19
ssl          15
spl          15
x509         12
stats        8
weird        8
capture_loss 3
dpd          3
notice       3
pe           1
```

We're accustomed to seeing the `uid` field in lots of Zeek log types, so what
if we adjusted our earlier approach and tried to add the SPL-SPT fields to
every Zeek event? Here we no longer need the `-P` option since we have all
of our data in the single ZNG file, though we still use `filter` to isolate
the relevant data in each `split` branch.

```
$ cat join-uid-many.zs
split (
  => filter _path!=spl | sort uid
  => filter _path=spl | sort uid
) | join uid=uid orig_spl,resp_spl,orig_spt,resp_spt

$ zq -z join-uid-many.zs -P results.zng results.zng > results-plus-spl.zng

$ zq -f table 'count() by _path | sort -r' results-plus-spl.zng
_PATH  COUNT
conn   168
dns    99
http   19
ssl    15
weird  8
dpd    3
notice 3
```

As we can see, several Zeek event types were not present in our ZNG output.
This happened because the current `join` implementation does not output
left-hand records whose schemas completely lack the referenced join key. Now
that we know this, we can isolate the remaining events and combine them with
our initial set, then see the expected full count.

```
$ zq 'filter not (_path=conn or _path=dns or _path=http or _path=ssl or _path=weird or _path=dpd or _path=notice)' results.zng \
  | zq - results-plus-spl.zng > all-results.zng

$ zq -f table 'count() by _path | sort -r' all-results.zng
_PATH        COUNT
conn         168
dns          99
files        57
http         19
spl          15
ssl          15
x509         12
stats        8
weird        8
dpd          3
notice       3
capture_loss 3
pe           1
```

Of course, we know SPL-SPT only targets SSL traffic, so maybe we're curious
to know if the `join` even succeeded on any of the other Zeek event types. We
can look for this by querying for non-null instances of our expected SPL-SPT
fields.

```
$ zq -f table 'orig_spl!=null or resp_spl!=null or orig_spt!=null or resp_spt!= null | count() by _path' all-results.zng
_PATH  COUNT
notice 3
spl    15
ssl    15
conn   15
```

If we look closer at those `notice` events, sure enough, they all were related
to SSL traffic and hence it makes sense that they'd contain the `uid` values
that matched in our `join`.

```
$ zq -f table 'orig_spl!=null _path=notice | count() by note' all-results.zng
NOTE                     COUNT
SSL::Invalid_Server_Cert 3
```

# Contact us!

If you have questions or feedback about this cookbook, we'd like to hear from
you! Please join our [public Slack](https://www.brimdata.io/join-slack/) or
[open an issue](https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue). Thanks!
