# Installation

Brim is an interactive desktop application for Windows, macOS, and Linux.
To install, click the link at the
[Brim download](https://www.brimdata.io/download/) page for your platform
and double-click to launch the installer.

The notes and short videos below show how to successfully install on each
platform.

   * [Windows Installation](#windows-installation)
   * [macOS Installation](#macos-installation)
   * [Linux Installation](#linux-installation)

Once installed, no additional configuration is necessary. For your reference,
a separate article describes the [[filesystem paths]] where unpacked Brim
binaries and saved user data are stored on each platform.

Details are provided in each section below about when Brim may "auto-update" to
newer releases and when manual upgrades are necessary. In all cases,
updating to a newer version of the app will preserve your existing
[user data](https://github.com/brimdata/brim/wiki/Filesystem-Paths#user-data). As the way user data
is stored sometimes changes in newer releases, downgrades to older releases are
_not_ currently supported.

For a walk through some typical operations in Brim to get started, watch the
[Brim Demo video](https://www.youtube.com/watch?v=InT-7WZ5Y2Y).

If you run into any problems, you may want to browse the
[wiki articles](https://github.com/brimdata/brim/wiki), perhaps starting with
[[Troubleshooting]]. If you get stuck, [join our public Slack](https://www.brimdata.io/join-slack/)
and we'll be happy to help.

## Windows Installation

* Download the Brim installer via the Windows link at the [Brim download](https://www.brimdata.io/download/) page
* Launch the downloaded `.exe` file to begin installation
* When prompted, click "I Agree" to accept the terms of the license agreement
* Brim will start automatically when install completes
* Click the Brim icon on the Desktop or Start menu to relaunch in the future

![Windows Installation](media/Windows-installation.gif)

As newer Windows releases are published, Brim will automatically download them
and pop up a notification offering to restart the app to apply the update.

## macOS Installation

* Download the Brim installer via the macOS link at the [Brim download](https://www.brimdata.io/download/) page
* Launch the downloaded `.dmg` file to begin installation
* Drag the Brim icon into the Applications folder
* Click the Brim icon in the Applications folder to start Brim now and in the future
* You may need to click through an "Are you sure?" prompt the first time Brim is launched

![macOS Installation](media/macOS-installation.gif)

As newer macOS releases are published, Brim will automatically download them
and pop up a notification offering to restart the app to apply the update.

## Linux Installation

* Uninstall any currently-installed Brim release, using a tool like `yum`,
   `dnf`, or `apt` (saved data and settings will not be disturbed by uninstall,
   as these are stored under a
   [user data](https://github.com/brimdata/brim/wiki/Filesystem-Paths#user-data)
   path that's separate from the
   [application binaries](https://github.com/brimdata/brim/wiki/Filesystem-Paths#application-binaries))
* Download either the `.deb` or `.rpm` Brim installer at the
  [Brim download](https://www.brimdata.io/download/) page, as appropriate
  for your Linux distribution
* Open the downloaded `.deb` or `.rpm` file in the Software Install utility and click "Install"
* Enter administration credentials, if prompted
* Click the Brim icon in the applications menu to start the app now and in the future

![Linux Installation](media/Linux-installation.gif)

As newer Linux releases are published, Brim will pop up a notification of their
availability, but the Linux releases do _not_ auto-update. Follow the link in
the pop-up to the [Download](https://www.brimdata.io/download/) page to
get the latest release and update it using the appropriate package manager for
your distribution.
