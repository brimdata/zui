# Filesystem Paths

- [Application Binaries (v0.25.0+)](#application-binaries-v0250)
- [Application Binaries (v0.24.0)](#application-binaries-v0240)
- [User Data (all versions)](#user-data-all-versions)

Occasionally when using Brim or troubleshooting problems with it, you may need
to know the location on the filesystem where the application binaries and/or user
data is stored. Below you'll find these details for each supported platform.

# Application Binaries (v0.25.0+)

When installed, the binaries and other supporting files that make up the Brim
application `v0.25.0` and newer are unpacked to the following path on each
platform:

|**OS Platform**|**Location**                                 |
|---------------|---------------------------------------------|
| **Windows**   | `%USERPROFILE%\AppData\Local\Programs\Brim` |
| **macOS**     | `/Applications/Brim.app`                    |
| **Linux**     | `/opt/Brim`                                 |

This filesystem location should be treated as read-only and is typically
only modified when a newer version of the app is being installed.

Since Brim is most often launched directly from the GUI environment in your OS,
you'll typically not need to access the application binaries directly. One
exception is if you wish to make use of the command line binaries that are
bundled with the app, such as [`zq`](https://github.com/brimdata/zed/tree/main/cmd/zed#zq),
[`zapi`](https://github.com/brimdata/zed/tree/main/cmd/zed#zapi),
[`brimcap`](https://github.com/brimdata/brimcap), and so forth. These can be
found in the `zdeps` subdirectory as follows:

|**OS Platform**|**Location**|
|---------------|------------|
| **Windows**   | `%USERPROFILE%\AppData\Local\Programs\Brim\resources\app.asar.unpacked\zdeps` |
| **macOS**     | `/Applications/Brim.app/Contents/Resources/app.asar.unpacked/zdeps` |
| **Linux**     | `/opt/Brim/resources/app.asar.unpacked/zdeps` |

While these binaries are also available for download as standalone
[Zed release](https://github.com/brimdata/zed/releases) packages, if you're
using Zed CLI commands to interact with a Pool in the Zed Lake that runs behind
Brim, you should typically use these bundled `zdeps` binaries since they've
been tested with the same version of Brim and can be considered API-compatible
with that version of the app.

# Application Binaries (v0.24.0)

When installed, the binaries and other supporting files that make up the Brim
application `v0.24.0` and older are unpacked to the following path on each
platform.

|**OS Platform**|**Location**                        |
|---------------|------------------------------------|
| **Windows**   | `%USERPROFILE%\AppData\Local\Brim` |
| **macOS**     | `/Applications/Brim.app`           |
| **Linux**     | `/usr/lib/brim`                    |


This filesystem location should be treated as read-only and is typically
only modified when a newer version of the app is being installed.

Since Brim is most often launched directly from the GUI environment in your OS,
you'll typically not need to access the application binaries. One exception is
if you wish to make use of the command line binaries that are bundled with the
app, such as [`zq`](https://github.com/brimdata/zed/tree/main/cmd/zed#zq),
[`zapi`](https://github.com/brimdata/zed/tree/main/cmd/zed#zapi), and so forth.
These can be found in the `zdeps` subdirectory as follows:

|**OS Platform**|**Location**|
|---------------|------------|
| **Windows**   | `%USERPROFILE%\AppData\Local\Brim\app-<version>\resources\app\zdeps` |
| **macOS**     | `/Applications/Brim.app/Contents/Resources/app/zdeps` |
| **Linux**     | `/usr/lib/brim/resources/app/zdeps` |

While these binaries are also available for download as standalone
[Zed release](https://github.com/brimdata/zed/releases) packages, if you're
using Zed CLI commands to interact with a Pool in the Zed Lake that runs behind
Brim, you should typically use these bundled `zdeps` binaries since they've
been tested with the same version of Brim and can be considered API-compatible
with that version of the app.

# User Data (all versions)

Saved data from your work in Brim is stored in a read/write filesystem path
that's separate from the application binaries. The top-level user data path on
each supported platform is:

|**OS Platform**|**Location**                                          |
|---------------|------------------------------------------------------|
| **Windows**   | `%APPDATA%\Brim`                                     |
| **macOS**     | `$HOME/Library/Application Support/Brim`             |
| **Linux**     | `$HOME/.config/Brim`                                 |

Particular categories of saved data are held under this path. Specific
categories of interest include:

   * `data` (subdirectory) - Storage of logs and other files you may have
     imported into Brim.

   * `logs` (subdirectory) - Logs for the running Brim app and the Zed backend
     that it launches for data storage and query.

   * `appState.json` (file) - Persistent app settings such as changes you've
     made to **Preferences**, contents of the **Query Library**, entries
     in the **History** panel, and so forth.

Generally you should not need to directly access the saved user data, though
it may prove necessary during [[Troubleshooting]] or if you use
[Zed](https://github.com/brimdata/zed/blob/main/cmd/zed/README.md)
or [Brimcap](https://github.com/brimdata/brimcap/blob/main/README.md) CLI tools
to perform scripted operations from outside the app against data that's stored
behind Brim.
