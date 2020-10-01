# Remote `zqd`

- TOC

# Summary

By default, the Brim application maintains a location on the local filesystem
for holding impoorted packet capture and log data. However, new features in
Brim and related [zq tools](https://github.com/brimsec/zq) allow the access of
remote data as well. This cookbook describes the available options and current
limitations.

# About Cookbooks

Cookbooks provide an opportunity to "test drive" new and/or experimental
features in the Brim application and related zq tools. They also walk through
some details of the "innards" of how Brim and zq tools function and therefore
may provide ideas for other creative variations.

All efforts are made to disclose known caveats and limitations that are
relevant to the configurations shown. However, due to the potential to
encounter bugs, it is recommended that you initially follow cookbooks in a
non-production, lab-style setting. As features become more stable, cookbooks
will be retired and replaced with regular [User Documentation](https://github.com/brimsec/brim/wiki#user-documentation).

Please report any bugs or usability issues you find when working with cookbooks
by [opening an issue](https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue)
or reaching out on the [Brim public Slack](https://www.brimsecurity.com/join-slack/).
We'd also love to hear your success stories and variations, so please don't be
shy!

# Limitations

Before diving into the specifics of what's possible, here's an overview of
some of functionality you may be hoping to find what's _not_ yet possible via
the configuration described in this article.

1. Logs and packet captures cannot be _imported_ from your local Brim to a
remote `zqd`. Any data you wish to access remotely will need to have been
staged remotely.

2. While the configuration potentially allows multiple remote users to access
the same centrally stored logs and packet captures, there's no concept of
authentication, individual user logins, or roles/permissions. Care should be
taken to avoid the accidental or malicious loss of centrally-stored data.

3. Brim does not yet immediately reflect the availability of new data as soon
as it's stored in a remote location. The steps below provide guidance on how to
"refresh" the Brim interface to ensure all remote data is available.

4. A known bug [brim/1099](https://github.com/brimsec/brim/issues/1099) will
"hang" Brim if configuration from an inaccessible remote `zqd` is present when
the application is being restarted.

# Background: Brim & `zqd`

As an icon you may double-click to start on your desktop, it's easy to see Brim
as a simple standalone application. However, it actually includes some
"backend" components that assist in providing the overall app experience.

One essential component is [`zqd`](https://github.com/brimsec/zq/tree/master/cmd/zqd),
a server-style [daemon](https://en.wikipedia.org/wiki/Daemon_(computing))
process that manages the storage and querying of imported packet/log data.
Operations in `zqd` are invoked via a
[REST API](https://en.wikipedia.org/wiki/Representational_state_transfer)
that's called by Brim as well as the
[`zapi`](https://github.com/brimsec/zq/tree/master/cmd/zapi) command line tool.

(insert image)

The location where `zqd` stores imported packet and log data is known as the
**Data Directory**. This location can be changed via a setting in Brim's
**Preferences** menu. The default locations for each platform are as follows:

|**OS Platform**|**Location**|
|---------------|------------|
| **Windows**   | `%APPDATA%\Brim\data\spaces`                         |
| **macOS**     | `$HOME/Library/Application Support/Brim/data/spaces` |
| **Linux**     | `$HOME/.config/Brim/data/spaces`                     |

If you examine the process table while Brim is running, you can observe the
command line the application used to start the backend `zqd` process. For
example, here is the process on a Mac laptop being operated by username "phil".

```
# ps auxww | grep zqd
phil             29475 180.6  0.2  5042684  32340   ??  R     4:38PM   0:01.16 /Applications/Brim.app/Contents/Resources/app/zdeps/zqd listen -l localhost:9867 -data /Users/phil/Library/Application Support/Brim/data/spaces -config /Users/phil/Library/Application Support/Brim/zqd-config.yaml -zeekrunner /Applications/Brim.app/Contents/Resources/app/zdeps/zeek/zeekrunner -brimfd=3
```

Some useful information is revealed via this command line:

1. The presence of the `listen` command is an indication that the `zqd` process
is prepared to accept REST API requests.

2. The option `-l localhost:9867` indicates that this `zqd` is only prepared to
accept connections that arrive on the host on which it's running, i.e. from a
Brim application or `zapi` tool running on the same host.

3. The `-data` option points to the **Data Directory** (the default in this
case).

4. The `-zeekrunner` option points to a script that is used to generate Zeek
logs from imported packet captures as described in the
[Zeek Customization](https://github.com/brimsec/brim/wiki/Zeek-Customization)
article.

5. The `-brimfd=3` is an option unique to when `zqd` is invoked by Brim,
which helps ensure that if Brim is killed abruptly the `zqd` process will also
be terminated (see [zq/1184](https://github.com/brimsec/zq/pull/1184)).

Now that we know Brim is simply connecting to `zqd` locally, we can build on
this approach to instead start a remote `zqd` and connect to it instead to
access the logs and packet captures stored there.

# Starting a remote `zqd`

