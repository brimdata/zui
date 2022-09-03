---
sidebar_position: 1
---

# Importing Parquet and ZST

Zui's ability to import data of diverse file formats via simple drag & drop
depends on the backend [Zed](https://zed.brimdata.io) platform's
ability to "auto-detect" these formats. While several formats are covered by
the current auto-detection implementation,
[Parquet](https://parquet.apache.org/) and
[ZST](https://zed.brimdata.io/docs/formats/zst/) are not
yet (see [zed/2517](https://github.com/brimdata/zed/issues/2517)).

This article shows how the Zed CLI tools can be used to preprocess data of
these formats into [ZNG](https://zed.brimdata.io/docs/formats/zng/)
that can be easily imported into Zui.

## Example

Preprocessing can be performed with the [`zq`](https://zed.brimdata.io/docs/commands/zq/)
CLI tool. These Zed CLI tools are included with Zui and can be found in the
`zdeps` directory under the Zui [application binaries](../support/Filesystem-Paths.md#application-binaries)
path.

Input file format can be specified via the `-i` option.

```
$ zq -h
NAME
    zq - process data with Zed queries

USAGE
    zq [ options ] [ zed-query ] file [ file ... ]

OPTIONS
...
    -i format of input data [auto,zng,zst,json,zeek,zjson,csv,parquet] (default "auto")
...
```

Here's an example `zq` command line on macOS to preprocess the test data
from [userdata1.parquet](https://github.com/Teradata/kylo/raw/master/samples/sample-data/parquet/userdata1.parquet)
into ZNG.

```
$ /Applications/Zui.app/Contents/Resources/app.asar.unpacked/zdeps/zq -i parquet userdata1.parquet > userdata1.zng
```

Now our `userdata1.zng` can be imported into Zui.

![Imported Parquet](media/Imported-Parquet.png)

## Contact us!

If you're struggling with importing alternate file formats or just have
questions, we'd like to hear from you! Please join our
[public Slack](https://www.brimdata.io/join-slack/)
and speak up, or [open an issue](../support/Troubleshooting.md#opening-an-issue). Thanks!
