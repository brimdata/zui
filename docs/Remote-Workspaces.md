# Remote Lakes

- [Summary](#summary)
- [About Cookbooks](#about-cookbooks)
- [Limitations](#limitations)
- [Background: Brim & Zed Lakes](#background-brim--zed-lakes)
- [Starting a Remote Zed Lake](#starting-a-remote-zed-lake)
- [Importing Data](#importing-data)
- [Accessing Our Remote Lake](#accessing-our-remote-lake)
- [Contact us!](#contact-us)

# Summary

By default, the Brim application connects to a Lake on the system on which
it is launched. This Lake includes [Zed Lake](https://github.com/brimdata/zed/blob/main/docs/zed/README.md)
storage on the local filesystem for holding imported data. However, Brim is
capable of accessing data stored in a Zed Lake in a remote Lake as well.
This cookbook describes the available options and current limitations.

# About Cookbooks

Brim cookbooks provide an opportunity to "test drive" new/experimental
features in the Brim application and related Zed tools. They also walk through
details of how Brim and Zed tools function and therefore may inspire other
creative configurations.

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

# Limitations

Before diving into the specifics of what's possible, here's an overview of
some rough edges you may encounter as you work through the configurations
described in this article.

1. While **logs** can be imported from your local Brim app directly to a remote
   Lake, **packet captures** currently cannot ([brim/1730](https://github.com/brimdata/brim/issues/1730)).

2. While the configuration potentially allows multiple remote users to access
   the same centrally-stored data, there's currently no concept of user
   authentication, individual logins, or roles/permissions. Care should be taken
   to avoid the accidental exposure or loss of centrally-stored data.

# Background: Brim & Zed Lakes

Since it's presented as an icon that can be double-clicked to launch it on
your desktop, it's easy to think of Brim as a simple standalone application.
However, the overall app experience is powered by a distributed "backend"
architecture that includes multiple components.

One essential component is the Zed Lake which is accessed via a
[`zed serve`](https://github.com/brimdata/zed/blob/main/docs/zed/README.md)
process that manages the storage and querying of imported data. Operations on
the Zed Lake are invoked via a [REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)
that's utilized by a "client", such as the Brim app. The
[`zed`](https://github.com/brimdata/zed#quick-start) command is also available
as a command line client that can perform many of the same operations as the
Brim app, and therefore may be useful in scripting and automation.

![Brim zed and the Zed Lake](media/Brim-zapi-zed-lake-serve.png)

The location where Zed stores imported data is known as the
**Data Directory**. This location can be changed via a setting in Brim's
**Preferences** menu. The default location is a `lake` subdirectory under the
Brim [user data](https://github.com/brimdata/brim/wiki/Filesystem-Paths#user-data)
path.

If you examine the process table while Brim is running, you can observe the
command line that was used to start the backend Zed process. For example,
here is the process on a Mac laptop being operated by username "phil".

```
macOS# ps auxww | grep zed
phil             37542   0.0  0.0  4277664    760 s001  S+   10:30AM   0:00.01 grep zed
phil             37512   0.0  0.2  5042424  29300   ??  S    10:30AM   0:01.50 /Applications/Brim.app/Contents/Resources/app.asar.unpacked/zdeps/zed serve -l localhost:9867 -R /Users/phil/Library/Application Support/Brim/data/lake -log.level=info -log.filemode=rotate -log.path /Users/phil/Library/Application Support/Brim/logs/zlake.log -brimfd=3
```

Some useful information revealed in this command line:

1. The inclusion of `localhost` in the option `-l localhost:9867` indicates
   this `zed serve` is prepared to accept _only_ connections that arrive from
   a client running on the same local host.

1. The `-R` option points to the Data Directory, which is the default
   location for macOS in this case.

1. The `-brimfd=3` is an option unique to when `zed serve` is launched by
   Brim. This helps ensure that if Brim is killed abruptly, the `zed` process will
   also be terminated (see [zed/1184](https://github.com/brimdata/zed/pull/1184)
   for details).

1. We can see the full path to the `zed` binary that's packaged with Brim. This
   binary and other dependencies that are typically launched by Brim can be found
   in the `zdeps` directory under Brim's [application binaries](https://github.com/brimdata/brim/wiki/Filesystem-Paths#application-binaries)
   path.

Now that we know Brim is simply connecting to Zed locally, next we'll vary
this approach to instead start a remote `zed serve` and connect to it to
access the data stored there.

# Starting a Remote Zed Lake

For our example remote host, we'll use a Linux Ubuntu 18.04 VM running in
Amazon AWS. Because Brim interacts with `zed serve` over a REST API that
is still evolving, care should be taken to ensure the Brim version being
installed on the remote side matches the version being run locally. In this
cookbook we'll use Brim v0.25.0, which includes Zed v0.30.0.

Even though our VM on AWS has no graphical interface, we'll install the full
Brim package because it includes the compatible Zed binaries as well as a
bundled [Brimcap](https://github.com/brimdata/brimcap) that will prove useful
if we want to import packet capture data.

```
ubuntu# wget --quiet https://github.com/brimdata/brim/releases/download/v0.25.0/Brim-0.25.0.deb
ubuntu# sudo apt update
ubuntu# sudo apt install -y ./Brim-0.25.0.deb
```

The following additional steps are also currently necessary to work around
issue [brim/1701](https://github.com/brimdata/brim/issues/1701).

```
ubuntu# sudo find /opt/Brim/resources/app.asar.unpacked/zdeps/suricata -exec chmod go+w {} \;
ubuntu# /opt/Brim/resources/app.asar.unpacked/zdeps/suricata/suricataupdater
```

> **Variation:** Rather than the full Brim package, we could instead
> [download a Zed package](https://www.brimdata.io/download/). The Zed
> package includes the binaries that could be used to construct command lines
> similar to those shown below. However, as the Zed tools are part of a general
> data system, they do not include Brimcap. This means such a configuration
> would either lack the ability to import packet data or would need to be
> augmented with a separate Brimcap install. The [Custom Brimcap Config](https://github.com/brimdata/brimcap/wiki/Custom-Brimcap-Config)
> article in the Brimcap wiki provides relevant guidance for this.

Since there's no desktop environment on this VM, there's no "app" interface to
see. Therefore we'll start `zed serve` manually from the
[application binaries](https://github.com/brimdata/brim/wiki/Filesystem-Paths#application-binaries-v0250) path for the Linux
platform as follows:

```
ubuntu# mkdir -p ~/.config/Brim/data/lake ~/.config/Brim/data/brimcap-root ~/.config/Brim/logs
ubuntu# /opt/Brim/resources/app.asar.unpacked/zdeps/zed serve \
          -l :9867 \
          -lake $HOME/.config/Brim/data/lake \
          -log.level=info \
          -log.filemode=rotate \
          -log.path $HOME/.config/Brim/logs/zlake.log
```

Building on what we learned earlier, we've made two adjustments here compared
to the command line Brim would have invoked:

1. `localhost` was dropped from the `-l` option. By providing only the port
   `:9867` specification, `zed serve` is now prepared to accept remote
   connections as well.

2. The `-brimfd=3` was dropped, since we're controlling the start/stop of Zed
   rather than the Brim app.

At this point `zed serve` is ready to accept remote connections. However,
the network between clients and our remote Zed Lake needs to permit this
connectivity. You'll need to perform whatever firewall/VPN configuration is
necessary for your environment to enable this. In our specific AWS example, one
way to achieve this is via a [Security Group](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_SecurityGroups.html)
configuration that permits incoming port `9867` connections from our client's
IP address.

![Security Group](media/Security-Group.png)

# Importing Data

As mentioned in the [Limitations](#Limitations) above, it's not possible for
remote Brim clients to import packet capture data directly to a remote Zed
Lake. However we can use the bundled `zed` command line tool to create a pool
in the Zed Lake for our data and then use the bundled `brimcap` to load data
into it.

As sample packet data, we'll import and index a [wrccdc pcap](https://wrccdc.org/)
from a separate shell on our Linux VM:

```
ubuntu# wget --quiet https://archive.wrccdc.org/pcaps/2018/wrccdc.2018-03-23.010014000000000.pcap.gz
ubuntu# gunzip wrccdc.2018-03-23.010014000000000.pcap.gz
ubuntu# export PATH="/opt/Brim/resources/app.asar.unpacked/zdeps:$PATH"

# Set ZED_LAKE env so zed knows to talk to the local zed service instance.
ubuntu# export ZED_LAKE=http://localhost:9867
ubuntu# zed create wrccdc
pool created: wrccdc 1xu2rXQ7D6ayTxrJE7XDVDS3mm8

ubuntu# zed use -p wrccdc
Switched to branch "main" on pool "wrccdc"

ubuntu# brimcap analyze wrccdc.2018-03-23.010014000000000.pcap | zed load -
1ulxiph6bNX4ZgubZFeCIIDaozj committed

ubuntu# brimcap index -root ~/.config/Brim/data/brimcap-root -r wrccdc.2018-03-23.010014000000000.pcap
```

While it's possible to import logs from the Brim app directly into a remote
Zed Lake, we can also use `zed` on our Linux VM. Here we'll import the Zeek
TSV logs from our [zed-sample-data](https://github.com/brimdata/zed-sample-data).

```
ubuntu# git clone --quiet --depth=1 https://github.com/brimdata/zed-sample-data
ubuntu# zed create zed-sample-data
pool created: zed-sample-data 1xu3fug3iq1y17RMQYRiCtORLMC

ubuntu# zed use -p zed-sample-data
Switched to branch "main" on pool "zed-sample-data"

ubuntu# zed load zed-sample-data/zeek-default/*
1uMRE9bZnbNAIY8tEOfIXOa8c2w committed
```

To see our imported data as pools in the Zed Lake:

```
ubuntu# zed ls
wrccdc 1uMPHXonxiBH1gY6TCCFxBNS99Z key ts order desc
zed-sample-data 1uMR6rGmrSBRHnB0yqOGnzhQb0b key ts order desc
```

# Accessing Our Remote Lake

Now that we've got data imported into our remote Zed Lake, we'll access it from
the Brim app that's running on our Mac laptop.

The option to initiate a remote connection is available by clicking the
pull-down above the pools list in the left panel and selecting **Add
Lake**.

![Add Lake](media/Add-Lake.png)

A window will pop up into which we can specify a name for our remote connection
along with its hostname or IP address. An optional port specification may also
be included if it's listening on a port other than the default `9867`.

![Add Lake window](media/Add-Lake-window.png)

Now the pools in our remote Zed Lake will appear in the left panel just as we're
accustomed to seeing when working with local data. We can now enter Zed queries
and perform normal workflows.

For our pool that was based on the imported packet capture, we'll only be able
to extract flows into Wireshark via the **Packets** button if we maintain a
copy of the same pcap locally and add it to the index in our local Brimcap root
(see [brimcap/105](https://github.com/brimdata/brimcap/issues/105) for details).

```
macOS# wget --quiet https://archive.wrccdc.org/pcaps/2018/wrccdc.2018-03-23.010014000000000.pcap.gz
macOS# gunzip wrccdc.2018-03-23.010014000000000.pcap.gz
macOS# export PATH="/Applications/Brim.app/Contents/Resources/app.asar.unpacked/zdeps:$PATH"
macOS# brimcap index -root "$HOME/Library/Application Support/Brim/data/brimcap-root" -r wrccdc.2018-03-23.010014000000000.pcap
```

![Opening flow](media/Brimcap-Remote-Flow-Wireshark.png)

You can import logs (but not pcaps) directly from your Brim app to the remote
Zed Lake in the same manner as you've been doing locally.

![Importing logs to remote Zed Lake](media/Remote-Zed-Lake-Import.gif)

Attempts to import a pcap directly to the remote Lake will fail with an
error message (see [brim/1730](https://github.com/brimdata/brim/issues/1730)
for details).

A connection to a remote Lake can be removed by selecting the **Get Info**
option in the pull-down and clicking **Logout**. This only removes the config
in your Brim app that references the remote Lake. It does not shutdown the
remote `zed serve` nor does it delete any data stored there.

![Get Lake info](media/Lake-Get-Info.png)

# Contact us!

If you have questions or feedback about this cookbook, we'd like to hear from
you! Please join our [public Slack](https://www.brimdata.io/join-slack/) or
[open an issue](https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue). Thanks!
