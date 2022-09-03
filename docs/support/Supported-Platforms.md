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
  - macOS Big Sur 11.6.8 or newer (see [below](#hardware) for hardware considerations)
- Linux
  - Ubuntu 20.04 or newer
  - Debian 10.0.0 or newer
  - Fedora 29 or newer
  - Rocky 8.3 or newer
  - CentOS 8.0 1905 (deprecated)

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

Basic [smoke testing](#smoke-testing) has also validated that Zui appears to
work on Windows 8.1 as well. Similar testing has also confirmed that Zui does
_not_ work on Windows 7. Therefore we do _not_ recommend attempting to run Zui
on releases older than Windows 8.1.

### macOS

#### Software

Zui's [test automation](#automated-testing) runs on Big Sur 11 and
therefore this is the macOS version on which we are best able to ensure quality
and prevent regressions. Several Zui developers also run macOS Monterey 12.5
and regularly perform ad hoc testing with it to reproduce reported issues.

Basic [smoke testing](#smoke-testing) has also validated that Zui appears to
work on macOS Mojave 10.14 as well. Similar testing has also confirmed that
Zui does _not_ work on macOS High Sierra 10.13. Therefore, we do _not_
recommend attempting to run Zui on macOS releases older than macOS Mojave
10.14.

#### Hardware

The build procedure for Zui's macOS releases creates binaries intended to
run on the Intel-based Mac hardware that make up many of the Macs in
use today. Zui releases are not yet available that are built specifically for
the recently-released [M1-based hardware](https://en.wikipedia.org/wiki/Apple_M1).
However, Apple's [Rosetta 2](https://support.apple.com/en-us/HT211861) makes
it possible to run Intel-targeted binaries on M1-based Macs, and
[smoke testing](#smoke-testing) has indicated that current Zui releases can
leverage this to run on M1-based Macs.

Due to issues of
[availability](https://github.com/actions/virtual-environments/issues/2187),
our automated tests for macOS run today on Apple hardware that is Intel-based
but not M1-based. Therefore if you have your choice of Mac hardware platform,
Intel-based is more strongly recommended. However, as we know the M1-based Macs
will become more popular in the future, please
[open issues](./Troubleshooting.md#opening-an-issue)
for problems you experience with Zui on M1-based Macs as you would any other.
If we should begin to accumulate bugs that are specific to M1-based hardware,
this will help guide the prioritization of our goal to deliver M1-specific
builds ([zui/1266](https://github.com/brimdata/brim/issues/1266)).

### Linux

Zui's [test automation](#automated-testing) runs on Ubuntu 20.04 (`.deb`
package) and therefore this is the Linux distribution on which we are best able
to ensure quality and prevent regressions.

An `.rpm` package is also provided that is periodically [smoke tested](#smoke-testing)
on Rocky 8.3. The [Rocky Linux site](https://rockylinux.org/about) explains that Rocky
seeks to maintain the [RHEL](https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux)-compatibility
mission formerly championed by [CentOS](https://www.centos.org/). Therefore the Rocky versions
listed in this article provide the basis of the Zui supportability expectation for the
equivalent RHEL version.

Basic [smoke testing](#smoke-testing) has also validated the _oldest_
release on which Zui appeared to work for each common distribution, as
follows:

- Ubuntu 20.04
- Debian 10.0.0
- Fedora 29
- Rocky 8.3
- CentOS 8 1905 (deprecated)

Therefore we do _not_ recommend attempting to run Zui on distributions older
than those listed above.

## Establishing Platform Supportability

The determination of the specific versions of platforms for which we can set
expectations of quality are based on multiple factors. These include:

- Support for the platform in dependent [development tools](#development-tools)
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
[continuous integration tests](https://github.com/brimdata/brim/blob/main/.github/workflows/ci.yml)
and [release workflow](https://github.com/brimdata/brim/blob/main/.github/workflows/release.yml).

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

This exercise was most recently performed in August, 2022 in preparation for
Zui release v1.0.0. For more details on
previously-performed smoke testing exercises, review [zui/1263](https://github.com/brimdata/brim/issues/1263),
[zui/2481](https://github.com/brimdata/brim/pull/2481), and [zui/2482](https://github.com/brimdata/brim/issues/2482).

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
