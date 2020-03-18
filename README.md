[![CircleCI](https://circleci.com/gh/brimsec/brim.svg?style=svg&circle-token=8fb219d4419937d21fb70c99c89157bff05c2ecc)](https://circleci.com/gh/brimsec/brim)

# Brim

Brim is an open source desktop application for security and network
specialists. Brim makes it easy to search and analyze data from:

- packet captures, like those created by [Wireshark](https://www.wireshark.org/), and
- structured logs, especially from the [Zeek](https://www.zeek.org) network analysis framework.

Brim is especially useful to security and network operators that need to handle large packet captures,
especially those that are cumbersome for Wireshark, tshark, or other packet analyzers.

![Brim](docs/media/brim-and-wireshark.gif?raw=true "Brim and Wireshark large pcap file comparison")

Brim is built from open source components, including:

- [zq](https://github.com/brimsec/zq), a structured log query engine;
- [Electron](https://www.electronjs.org/) and [React](https://reactjs.org/) for multi-platform UI;
- [Zeek](https://www.zeek.org), to generate network analysis data from packet capture files.

## Installing Brim

The easiest way to install Brim is to download the installation package for
your platfrom from the latest
[release](https://github.com/brimsec/brim/releases).

## Development and contributing

We'd love your help! Please see the [contributing guide](CONTRIBUTING.md) for
development information like building and testing Brim.
