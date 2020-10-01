# Remote `zqd`

- TOC

# Summary

By default, the Brim application leverages the local filesystem for holding
imported logs and packet capture data. However, new features in Brim and
related [zq tools](https://github.com/brimsec/zq) enable access to data stored
remotely as well. This cookbook describes the available options and current
limitations.

# About Cookbooks

Brim cookbooks provide an opportunity to "test drive" new and/or experimental
features in the Brim application and related zq tools. They also walk through
some details of the "innards" of how Brim and zq tools function and therefore
may inspire other creative ideas.

All efforts are made to disclose known caveats and limitations that are
relevant to the configurations shown. However, due to the potential to
encounter bugs in evolving functionality, it is recommended that you initially
follow cookbooks in a non-production, lab-style setting. As features become
more stable, cookbooks may be retired and replaced with regular
[User Documentation](https://github.com/brimsec/brim/wiki#user-documentation).

Please report any bugs or usability issues you find when working with cookbooks
by [opening an issue](https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue)
or reaching out on the [Brim public Slack](https://www.brimsecurity.com/join-slack/).
We'd also love to hear your success stories and variations, so please don't be
shy!

# Limitations

Before diving into the specifics of what's possible, here's an overview of
some of the rough edges you may encounter as you work through the
configurations described in this article.

1. Logs and packet captures cannot be _imported_ from your local Brim to a
remote `zqd`. Any data you wish to access remotely will need to have been
staged at the remote location.

2. While the configuration potentially allows multiple remote users to access
the same centrally stored logs and packet captures, there's currently no
concept of user authentication, individual logins, or roles/permissions. Care
should be taken to avoid the accidental exposure or loss of centrally-stored
data.

3. The Brim application does not yet immediately reflect the availability of
new data as soon as it's added to a remote location. The steps below provide
guidance on how to "refresh" the Brim interface to ensure all remote data is
available.

4. A known bug [brim/1099](https://github.com/brimsec/brim/issues/1099) will
cause Brim to "hang" if configuration pointing to an inaccessible remote `zqd`
is present when the application is restarted.

# Background: Brim & `zqd`

Since it's presented as an icon you may double-click to start the app on your
desktop, it's easy to see Brim as a simple standalone application. However, it
actually includes some "backend" components that assist in providing the
overall app experience.

One essential component is [`zqd`](https://github.com/brimsec/zq/tree/master/cmd/zqd),
a server-style process that manages the storage and querying of imported
log/packet data.  Operations in `zqd` are invoked via a
[REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)
that's called by Brim and/or the
[`zapi`](https://github.com/brimsec/zq/tree/master/cmd/zapi) command line tool.

![Brim zapi and zqd](media/Brim-zapi-zqd.png)

The location where `zqd` stores imported logs and packet capture data is known
as the **Data Directory**. This location can be changed via a setting in Brim's
**Preferences** menu. The default locations on each platform are as follows:

|**OS Platform**|**Location**|
|---------------|------------|
| **Windows**   | `%APPDATA%\Brim\data\spaces`                         |
| **macOS**     | `$HOME/Library/Application Support/Brim/data/spaces` |
| **Linux**     | `$HOME/.config/Brim/data/spaces`                     |

If you examine the process table while Brim is running, you can observe the
command line that was used to start the backend `zqd` process. For example,
here is the process on a Mac laptop being operated by username "phil".

```
macOS# ps auxww | grep zqd
phil             29475 180.6  0.2  5042684  32340   ??  R     4:38PM   0:01.16 /Applications/Brim.app/Contents/Resources/app/zdeps/zqd listen -l localhost:9867 -data /Users/phil/Library/Application Support/Brim/data/spaces -config /Users/phil/Library/Application Support/Brim/zqd-config.yaml -zeekrunner /Applications/Brim.app/Contents/Resources/app/zdeps/zeek/zeekrunner -brimfd=3
```

Some useful information is revealed via this command line:

1. The presence of the `listen` command indicates that the `zqd` process is
prepared to accept REST API requests.

2. The option `-l localhost:9867` indicates that this `zqd` is prepared to
accept _only_ connections that arrive on the host on which it's running, i.e.
from a Brim application or `zapi` tool running on the same host.

3. The `-data` option points to the **Data Directory** (the default location
for macOS in this case).

4. The `-zeekrunner` option points to a script that is used to generate Zeek
logs from imported packet captures as described in the
[Zeek Customization](https://github.com/brimsec/brim/wiki/Zeek-Customization)
article.

5. The `-brimfd=3` is an option unique to when `zqd` is launched by Brim,
which helps ensure that if Brim is killed abruptly the `zqd` process will also
be terminated (see [zq/1184](https://github.com/brimsec/zq/pull/1184) for
details).

Now that we know Brim is simply connecting to `zqd` locally, we can build on
this approach to instead start a remote `zqd` and connect to it to access the
logs and packet captures stored there.

# Using a remote `zqd`

For our example remote host, we'll use a Linux Ubuntu 18.04 VM running in
Amazon AWS. Because Brim interacts with `zqd` over a REST API that is still
evolving, care should be taken to ensure the version being installed on the
remote side matches the version being run locally. In this cookbook we'll use
Brim `v0.18.0`.

Even though our VM on AWS has no graphical interface, we'll install the full
Brim package because it includes a compatible `zqd` binary as well as an
embedded Zeek that will prove useful if we want to import padcket capture data
that could be accessed remotely.

```
aws-linux# wget https://github.com/brimsec/brim/releases/download/v0.18.0/brim_amd64.deb
aws-linux# sudo sudo apt install -y ./brim_amd64.deb
```

Once Brim is installed, the `zqd` binary and other dependencies that are
typically launched by Brim can be found in the following location on each
platform:

|**OS Platform**|**Location**|
|---------------|------------|
| **Windows**   | `%USERPROFILE%\AppData\Local\Brim\app-<version>\resources\app\zdeps |
| **macOS**     | `/Applications/Brim.app/Contents/Resources/app/zdeps` |
| **Linux**     | `/usr/lib/brim/resources/app/zdeps`                   |

Applying what we learned earlier about how Brim typically launhces its local
`zqd`, we create the following adjusted command line to start one on our VM
that's prepared to accept connections from remote apps.

```
