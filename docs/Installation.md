---
sidebar_position: 2
sidebar_label: Installation
---

# Installation

Zui is an interactive desktop application for Windows, macOS, and Linux.
To install, click the link at the
[Zui download](https://www.brimdata.io/download/) page for your platform
and double-click the downloaded package to launch the installer.

The notes and short videos below show how to successfully install on each
platform.

   * [Windows Installation](#windows-installation)
   * [macOS Installation](#macos-installation)
   * [Linux Installation](#linux-installation)

Once installed, no additional configuration is necessary. For your reference,
a separate article describes the [filesystem paths](./support/Filesystem-Paths.md) where unpacked Zui
binaries and saved user data are stored on each platform.

Details are provided in each section below about when Zui may "auto-update" to
newer releases and when manual upgrades are necessary. In all cases,
updating to a newer version of the app will preserve your existing
[user data](./support/Filesystem-Paths.md#user-data). Because the way user data
is stored sometimes changes in newer releases, downgrades to older releases are
_not_ currently supported.

For a walk through some typical operations in Zui to get started, watch the
[Zui demo video](https://www.youtube.com/watch?v=InT-7WZ5Y2Y).

If you run into any problems, you may want to browse the 
[troubleshooting docs](./support/Troubleshooting.md). If you get stuck, [join our public Slack](https://www.brimdata.io/join-slack/)
and we'll be happy to help.

## Windows Installation

* Download the Zui installer via the Windows link at the [Zui download](https://www.brimdata.io/download/) page
* Launch the downloaded `.exe` file to begin installation
* When prompted, click "I Agree" to accept the terms of the license agreement
* Zui will start automatically when install completes
* Click the Zui icon on the Desktop or Start menu to relaunch in the future

![Windows Installation](media/Windows-installation.gif)

As newer Windows releases are published, Zui will automatically download them
and pop up a notification offering to restart the app to apply the update.

## macOS Installation

* Download the Zui installer via the macOS link at the [Zui download](https://www.brimdata.io/download/) page
* Launch the downloaded `.dmg` file to begin installation
* Drag the Zui icon into the Applications folder
* Click the Zui icon in the Applications folder to start Zui now and in the future
* You may need to click through an "Are you sure?" prompt the first time Zui is launched

![macOS Installation](media/macOS-installation.gif)

As newer macOS releases are published, Zui will automatically download them
and pop up a notification offering to restart the app to apply the update.

## Linux Installation

* Uninstall any currently-installed Zui release, using a tool like `yum`,
   `dnf`, or `apt` (saved data and settings will not be disturbed by uninstall,
   as these are stored under a
   [user data](./support/Filesystem-Paths.md#user-data)
   path that's separate from the
   [application binaries](support/./Filesystem-Paths.md#application-binaries))
* Download either the `.deb` or `.rpm` Zui installer at the
  [Zui download](https://www.brimdata.io/download/) page, as appropriate
  for your Linux distribution
* Open the downloaded `.deb` or `.rpm` file in the Software Install utility and click "Install"
* Enter administration credentials, if prompted
* Click the Zui icon in the applications menu to start the app now and in the future

![Linux Installation](media/Linux-installation.gif)

As newer Linux releases are published, Zui will pop up a notification of their
availability, but the Linux releases do _not_ auto-update. Follow the link in
the pop-up to the [Zui download](https://www.brimdata.io/download/) page to
get the latest release and update it using the appropriate package manager for
your distribution.
