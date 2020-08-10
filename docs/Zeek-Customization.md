# Zeek Customization

- [Summary](#summary)
- [Details](#details)
- [Contact us!](#contact-us)

# Summary

Brim uses [Zeek](https://www.zeek.org) to generate Zeek logs from pcaps; the Zeek logs are then combined and stored in
 [ZNG](https://github.com/brimsec/zq/blob/master/zng/docs/spec.md) format. Brim comes with a Zeek bundle
it uses just for this process.

Starting with `v0.10.0`, Brim can be configured to use a Zeek setup other than its default. This may be useful for:

   * Users with an existing Zeek installation, to generate logs in Brim similar to their existing Zeek logs.
   * Users that want to experiment with a Zeek configuration different from the Brim default.
   * Zeek script authors that would like to use Brim as a script development aid.

To use a different Zeek setup, there is now a Brim preference to specify the Zeek "runner", an executable script or 
command run when a pcap import occurs, which launches Zeek to read the pcap's data & write Zeek logs. The next
section describe how to change the runner preference to point to leverage an existing customized Zeek install, and
the following section shows how to start from Brim's own Zeek binary packages to create your own customized Zeek.

# Using the Zeek Runner Preference

Brim uses an executable script or command, called a Zeek "runner", to execute Zeek with any needed environment variables,
command line options, or other configuration. A Brim preference is available to specify the location of the Zeek runner
to use. To use a different Zeek setup to generate logs from pcaps, you should provide a runner that references the
desired Zeek setup.

Below is the runner in Brim v0.10.0 that invokes the included Zeek bundle on Linux and macOS. It's a script located at the top of the builtin
Zeek bundle's installation directory, so it refers to the Zeek executable and other paths relative to its own location.
On Windows, an executable `zeekrunner.exe` with equivalent functionality is used instead.
When a user imports a pcap file into Brim, the runner is executed with the pcap's data passed via stdin, and the 
runner's working directory set to the desired output location for the Zeek logs. 

```bash
#!/usr/bin/env bash

dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"

export ZEEKPATH="$dir/share/zeek:$dir/share/zeek/policy:$dir/share/zeek/site"
export ZEEK_PLUGIN_PATH="$dir/lib/zeek/plugins"

# The packet filter and loaded scripts are disabled because they emit either
# timeless logs or logs with timestamp set to execution time rather than time
# of capture.
exec "$dir/bin/zeek" \
  -C -r - \
  --exec "event zeek_init() { Log::disable_stream(PacketFilter::LOG); Log::disable_stream(LoadedScripts::LOG); }" \
  local
```

The above script works as-is for a Zeek installation created by the Zeek build system. So, if you've built Zeek locally
via `./configure --prefix=/usr/local/myzeek`, you could copy the above script to `/usr/local/myzeek/zeekrunner`, then
specify `/usr/local/myzeek/zeekrunner` in the Brim preferences, restart Brim, and then import pcaps using the Zeek
setup at `/usr/local/myzeek`.

**Note:** If you change the location of the Zeek runner, you'll need to restart Brim. However, a
restart is only required if the location of the runner changes, not if the runner itself is updated. If you edit the
runner without altering its location, any changes will take effect on the next pcap import.

You can specify the location of your Zeek runner via the setting in the **Preferences** menu:

![Zeek Runner Preference](media/Preferences-Zeek-Runner.png)

# Creating Your Customized Zeek

If you're experienced at [installing Zeek](https://docs.zeek.org/en/current/install/install.html), you may have the best luck
by building and testing such a Zeek installation via those standard instructions. This will give you the most flexibility in
terms of being able to use the [Zeek Package Manager](https://docs.zeek.org/projects/package-manager/en/stable/) to add
extensions, compile plugins, or even make changes to the core Zeek C++ code if you choose.

However, situations may arise when this is impossible or difficult. Some examples:

1. **Microsoft Windows**. Zeek is not officially supported on Windows, and Brim's
[fork of Zeek](https://github.com/brimsec/zeek) that includes limited Windows support is unfortunately not easy to compile
outside of a customized build environment.
2. **Lack of expertise**. The Zeek install/buld process may seem daunting to new users.
3. **Minimal changes**. If you seek to only make minor Zeek script additions/changes, creating a full standalone
Zeek environment may seem like overkill.
changes/additions to Zeek scripts

In such situations, you may be able to start from one of the binary Zeek artifacts that's bundled into Brim and add your
customizations. You should be aware of the following limitations:

1. Only changes involving Zeek scripts are possible. Zeek plugins that include C++ code require a build environment.
2. Script additions/changes must be performed manually, as the
[Zeek Package Manager](https://docs.zeek.org/projects/package-manager/en/stable/) is not available in the Brim Zeek artifacts.

## Example

The following example shows how to create and use such a customized Zeek to add the
[zeek-log-all-http-headers](https://github.com/sethhall/zeek-log-all-http-headers) package. Windows PowerShell is used here,
but as the steps involve only unpacking and editing files, the equivalent steps on macOS and Linux should be intuitive.

1. **Create an empty folder** in which to create your custom Zeek

```
mkdir C:\temp\zeek
cd \temp\zeek
```

2. **Download and unpack a current Brim Zeek artifact** for your platform from the
[releases](https://github.com/brimsec/zeek/releases] page.

```
```

3. **Add/modify the Zeek scripts to suit your needs.** In this case, we're going to be enabling the Zeek scripts from the
[zeek-log-all-http-headers](https://github.com/sethhall/zeek-log-all-http-headers) package. Since the scripts are in a GitHub
repo, This can most easily be done if we have [`git`](https://git-scm.com/) installed and in our path. Customizations are
typically made in the `zeek/share/zeek/site/local/` directory, so that's where we'll unpack them here.

```
cd zeek\share\zeek\site\local
git clone https://github.com/sethhall/zeek-log-all-http-headers
```

4. **Ensure the added/modified scripts are loaded.** Brim's Zeek Runner always loads `zeek/share/zeek/site/local/local.zeek`,
so here we can add a line to the end of this file with an appropriate `@load` directive.

```
```

5. **Test the customized Zeek.** If the modifications to your custom Zeek aren't working outside of Brim, they'll never work
when the Zeek is invoked by Brim. To test, pipe a packet capture through the Zeek Runner script to generate logs, then
examine the logs to see if the expected changes are present.

6. **Set the Zeek Runner Preference.** If the test is successful, follow the instructions above to set the Brim preference
to the location of your Zeek Runner, restart Brim, and import a pcap.

# Contact us!

If you're using a custom Zeek setup with Brim, we'd like to hear from you! Whether you've found an interesting 
Zeek feature that could be useful to other Brim users, or are generating logs that match your existing Zeek setup, 
or (especially) if you hit challenges and need help, please join our
[public Slack](https://join.slack.com/t/brimsec/shared_invite/zt-cy34xoxg-hZiTKUT~1KdGjlaBIuUUdg)
and tell us about it, or
[open an issue](https://github.com/brimsec/brim/wiki/Troubleshooting#opening-an-issue). Thanks!
