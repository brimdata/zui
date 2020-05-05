# Supported Platforms

- [Summary](#summary)
- [Per-Platform Details](#per-platform-details)
  * [Windows](#windows)
  * [macOS](#macos)
  * [Linux](#linux)

# Summary

[Downloadable packages](https://www.brimsecurity.com/download/) for Brim are
available that run on Windows, macOS, and Linux. The specific
versions/distributions of these platforms for which we can set expectations of
quality are affected by end-of-life cycles and their availability in our
automated test infrastructure.

The sections below describe the details regarding the versions we test with
continuously as well as occasional ad hoc testing. We welcome you to
[open an issue](Troubleshooting.md#opening-an-issue) on any problem you
experience with Brim regardless of platform version, but please understand
that we may be limited in our ability to provide quick fixes (or any fix at
all) for some platform versions.

# Per-Platform Details

## Windows

Our Windows test automation runs on Windows Server 2019, and therefore this is
the platform on which we are best able to ensure quality and prevent
regressions. Several Brim developers also run Windows 10 on their desktops
and regularly perform ad hoc testing with it and attempt to reproduce issues on
Windows 10.

Brim is written using tools that have their own platform limitations. Per the
supported platform guidance for [Electron](https://www.electronjs.org/docs/tutorial/support#supported-platforms)
and [Go](https://golang.org/doc/install#requirements), Windows versions
_older_ _than_ Windows 7 or Windows Server 2008R2 are not expected to work at
all.

We've been informed anecdotally that users are running Brim successfully on
Windows 7. However, as [Windows 7 is end-of-life](https://support.microsoft.com/en-us/help/4057281/windows-7-support-ended-on-january-14-2020),
we have no access to this platform to reproduce reported issues or test fixes.
We will make all attempts to provide  "best effort" support on reported Windows
7 issues, but please understand that if we're unable to reproduce them on
Windows Server 2019 or Windows 10, we may not be able to address them.

## macOS

Our macOS test automation runs on Catalina 10.15, and therefore this is
the platform on which we are best able to ensure quality and prevent
regressions.

Brim is written using tools that have their own platform limitations. Per the
supported platform guidance for [Electron](https://www.electronjs.org/docs/tutorial/support#supported-platforms) 
and [Go](https://golang.org/doc/install#requirements), macOS versions _older_
_than_ 10.11 are not expected to work at all.

We've been informed anecdotally that users are running Brim successfully on
some of these macOS releases older than 10.15. However, we do not have the
ability to easily "spin up" test environments with arbitrary macOS versions to
reproduce reported issues or test fixes. We will make all attempts to provide
"best effort" support on macOS releases other than 10.15, but please understand
that if we're unable to reproduce them on Catalina 10.15, we may not be able
to address them.

## Linux

Our Linux test automation runs on Ubuntu 18.04, and therefore this is
the platform on which we are best able to ensure quality and prevent
regressions.

As we publish both `.deb` and `.rpm` installers, we do perform occasional ad
hoc testing on Fedora to ensure the package installs and runs correctly on
this Red Hat-derived variant.

Brim is written using tools that have their own platform limitations. Per the
supported platform guidance for [Electron](https://www.electronjs.org/docs/tutorial/support#supported-platforms)
and [Go](https://golang.org/doc/install#requirements), Linux distributions
_older_ _than_ Ubuntu 12.04, Fedora 21, or Debian 8 are not expected to work
at all.
