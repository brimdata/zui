---
sidebar_position: 1
---

# Supported Platforms

[Downloadable packages](https://www.brimdata.io/download/) for Zui are
available that run on Windows, macOS, and Linux. Our current platform
recommendations on which to run Zui:

- Windows
  - Windows 10 or newer
  - Windows Server 2019 or newer
- macOS
  - macOS Monterey 12.6.5 or newer (see [below](#hardware) for hardware considerations)
- Linux
  - Ubuntu 20.04 or newer
  - Debian 11.0.0 or newer
  - Fedora 31 or newer
  - Rocky 9.0 or newer

The sections below provide details regarding these guidelines and how they are
established.

## Per-Platform Details

### Windows

Zui's [test automation](#automated-testing) runs on Windows Server
2019 and therefore this is the platform on which we are best able to ensure
quality and prevent regressions.
[Microsoft support statements](https://docs.microsoft.com/en-us/windows/release-information/status-windows-10-20h2)
simultaneously target both Windows 10 and Windows Server, so our quality
expectations between Windows 10 and Windows Server 2019 are equivalent. Several
Zui developers also run Windows 10 desktops and regularly perform ad hoc
testing with it to reproduce reported issues.

As Microsoft has announced
[end of support for Windows 8.1](https://learn.microsoft.com/en-us/lifecycle/products/windows-81)
we do _not_ recommend attempting to run Zui on Windows 8.1 or older.

### macOS

#### Software

Zui's [test automation](#automated-testing) runs on Monterey 12 and
therefore this is the macOS version on which we are best able to ensure quality
and prevent regressions. Several Zui developers also run macOS Sonoma 14.1
and regularly perform ad hoc testing with it to reproduce reported issues.

#### Hardware

The build procedure for Zui's macOS releases creates binaries intended to
run on Intel-based Mac hardware. Zui releases are not yet available that
are built specifically for [M1-based hardware](https://en.wikipedia.org/wiki/Apple_M1).
However, Apple's [Rosetta 2](https://support.apple.com/en-us/HT211861) makes
it possible to run Intel-targeted binaries on M1-based Macs.

M1-based hardware has only recently become
[available](https://github.com/actions/virtual-environments/issues/2187) for
our automation where we run tests and create builds for Zui. Therefore our
planned work to deliver M1-specific builds ([zui/1266](https://github.com/brimdata/zui/issues/1266))
is still ongoing. In the meantime, please [open an issue](./Troubleshooting.md#opening-an-issue)
if you experience a problem specific to M1-based Macs.

### Linux

Zui's [test automation](#automated-testing) runs on Ubuntu 20.04 (`.deb`
package) and therefore this is the Linux distribution on which we are best able
to ensure quality and prevent regressions.

An `.rpm` package is also provided that is periodically [smoke tested](#smoke-testing)
on Rocky 9.0. The [Rocky Linux site](https://rockylinux.org/about) explains that Rocky
seeks to maintain the [RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)-compatibility
mission formerly championed by [CentOS](https://www.centos.org/). Therefore the Rocky versions
listed in this article provide the basis of the Zui supportability expectation for the
equivalent RHEL version.

Basic [smoke testing](#smoke-testing) has also validated the _oldest_
release on which Zui appeared to work for each common distribution, as
follows:

- Ubuntu 20.04
- Debian 11.0.0
- Fedora 31
- Rocky 9.0

Therefore we do _not_ recommend attempting to run Zui on distributions older
than those listed above.

## Establishing Platform Supportability

The determination of the specific versions of platforms for which we can set
expectations of quality are based on multiple factors. These include:

- Support for the platform in [development tools](#development-tools)
- Availability of the platform for [automated testing](#automated-testing)
  and/or [smoke testing](#smoke-testing)

The following sections provide more detail, along with guidance if you feel
strongly about trying to make Zui run on a [non-recommended platform](#non-recommended-platforms).

### Development Tools

There are two primary development tools on which Zui depends:
[Electron](https://www.electronjs.org/docs/latest/development/README)
and [Go](https://github.com/golang/go/wiki/MinimumRequirements). Their support
statements cite older platform releases than the Zui-specific ones cited above.
Therefore the recommendations at the top of this page should be followed.

### Automated Testing

The most extensive testing of Zui is provided via automation that is run on
[GitHub Actions](https://github.com/features/actions). Specific platform
versions of
hosted [runners](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners) are referenced in the automation for Zui's
[continuous integration tests](https://github.com/brimdata/zui/blob/main/.github/workflows/ci.yml)
and [release workflow](https://github.com/brimdata/zui/blob/main/.github/workflows/release.yml).

### Smoke Testing

Due to the large number of permutations of platforms (especially as relates to
Linux distributions), it is currently infeasible to provide the same exhaustive
automated coverage on every version of every possible platform. Occasionally,
manual "smoke testing" has been performed on a wider number of platforms to
confirm basic functionality. Such a smoke test consists of the following:

- Install the base platform while accepting the defaults on any offered install-time config options
- Install the Zui app using the standard package install procedure for the platform
- Import a test pcap into Zui and confirm the bundled Zeek and Suricata both produce records from it
- Click the **Packets** button to extract a slice from the pcap into Wireshark

This exercise was most recently performed in November, 2023 with Zui release
[v1.4.1](https://github.com/brimdata/zui/releases/tag/v1.4.1).

### Non-Recommended Platforms

While we welcome you to
[open an issue](./Troubleshooting.md#opening-an-issue)
about any problem you experience with Zui regardless of platform version,
the priority of the core Zui development team is to maintain stability and
introduce new features on the modern platforms that are most widely used.
Therefore we may be limited in our ability to provide timely fixes (or any fix
at all) for platform versions older/different from those recommended above.

We also understand that certain users may have a strong motivation to make Zui
work on other platforms. As Zui is open source, community members are welcomed
to perform their own research regarding such platforms and contribute
[advanced guides](../advanced/README.md) that may be of
use to other users seeking to run on the same platform. Before embarking on
such an effort, we recommend
[opening an issue](./Troubleshooting.md#opening-an-issue)
to check if we're aware of any existing efforts regarding that platform.
