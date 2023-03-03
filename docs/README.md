---
sidebar_position: 1
sidebar_label: Introduction
---

# The Zui Desktop Application

Zui (formerly called Brim) is a graphical user interface for exploring data in
[Zed lakes](https://zed.brimdata.io/docs/commands/zed). While these docs are
specific to the Zui app experience, you may want to browse the separate
[docs for the Zed project](https://zed.brimdata.io/docs) on topics such as:

* the [Zed language](https://zed.brimdata.io/docs/language) that's used in Zui for queries and analytics,
* the [command-line tools](https://zed.brimdata.io/docs/commands) that work alongside Zui, and
* the [Zed data formats](https://zed.brimdata.io/docs/formats).

## Getting Started

Trying out Zui is easy: just [install](./Installation.md) the package for
your operating system. Once you launch the app, click **Import Data**
on the welcome screen and drag & drop a file of one of the formats
shown. Simple operations such as filtering and "count by" are available in a
menu that appears when you right-click on values in your data. When you're ready
to perform more sophisticated queries and aggregations, consult the
[Zed language](https://zed.brimdata.io/docs/language) docs.

## Behind the Name Change

When Brim began as a company, we intended to build a security-focused desktop
application powered by our backend called [Zed](https://zed.brimdata.io/). The
company's main product was the app, so we called it the Brim app.

As we developed Zed, we started to realize we had something big on our hands.
Zed's data model, language, query engine, and storage formats provided
revolutionary new ways to work with all kinds of data. In April 2021, we
decided to pivot, making Zed the company's flagship technology. Brim Security
became [Brim Data](https://www.brimdata.io/).

This change made us question the purpose of the app. We were now leading with
the [Zed lake](https://zed.brimdata.io/docs/commands/zed), so we decided
the app would support the lake. Users would be able to explore a lake's data
and manage its configuration with the app. It would be a GUI for Zed.

At this point, having the app named after the company was confusing. We needed
a name that clearly tied the app to Zed. After many fun naming sessions, we
played off the word "GUI" and landed on "Zui": Zed user interface.

:::tip pcap processing
Functionality related to pcap processing (including the generation of Zeek and
Suricata summary logs from pcaps and pcap import/extraction workflows) is
handled by [Brimcap](https://github.com/brimdata/brimcap), which is bundled
with Zui. A separate [Brimcap wiki](https://github.com/brimdata/brimcap/wiki)
contains current docs related to pcap processing.
:::

## Zui Insiders

While GA versions of Zui will be released periodically, it's evolving fast.
If you're interested in keeping up with the very latest enhancements and bug
fixes, you can download the
[Zui - Insiders](https://github.com/brimdata/zui-insiders) app. It can run
side-by-side with regular Zui, stores data in a different location, and runs
the Zed lake service on a different port. It receives automatic updates every
weekday built from the tip of our `main` Zui branch. This is our take on a beta
program. If you find bugs or think of improvements, please chime in on the
[#zui-insiders](https://brimdata.slack.com/archives/C03MW6XT7HC) Slack channel.
