## v0.30.0

In this small release, we've fixed bugs and upgraded some core dependencies like Electron and React.

- Upgrade to Electron 15, Node 16 (#2342)
- Upgrade to React 18 (#2327)
- Fix "Pivot to Logs" corner cases (#2354) (#2346)
- Fix `zed -version` and `brimcap -version` output (#2349)
- Fix rendering of big arrays that would previously crash the app (#2348)
- Fix bug causing the "About" window to appear blank (#2347)

## v0.29.0

### Where are my pools?

Your pools are still here! But you need to run a migration script to convert them to the new Zed lake data format.

**[How to migrate](https://github.com/brimdata/brim/wiki/Migration-for-Version-0.29)**

If you don't care to keep the old data, no need to run the migration. The app will work fine. Click the link above to learn how to remove the old pools if you desire.

### New Features

This release includes exciting new features we hope you'll find very useful. However, most of the work for this release was focused on the Zed backend that powers Brim. Zed 1.0 is here! Check out the [release notes for Zed 1.0](https://github.com/brimdata/zed/blob/v1.0.0/CHANGELOG.md#v100)

### Inspector View

The largest new feature you'll notice is the addition of the inspector view. The inspector lets you clearly see the shape of nested data structures. You can expand or collapse data containers like records and arrays.

You can toggle back and forth between this view and the familiar table view.

The buttons on the right of the results header will expand and collapse all the nested data structures.

### New Font

Brim now uses the excellent, open source [Recursive](https://www.recursive.design/) font family to display your data.

### Other Interesting Changes

- Update Zed to [v1.0.0](https://github.com/brimdata/zed/releases/tag/v1.0.0)
- Save the scroll position when switching between table and inspector (#2271)
- Add a JSON export format (#2269)
- Use Recursive Mono as our data font (#2259)
- Allow the default Brim query folder to be moved (#2178)
- Always show queries section in the sidebar (#2177)
- Move to a new Zed Root Directory (#2158)
- Big upgrade to Zealot, the JavaScript Zed client (#2124, #1983)
- Use yarn instead of npm (#2059)
- Add ability to save queries in the lake (#2036)
- Set BRIM_SURICATA_USER_DIR in the brimcap plugin (#1964)
- Introduce the Zed Inspector (#1981)
- Make our type checking stricter (#1984)
- Upgrade Electron to v14 and replace Spectron with Playwright (#1985)
- New Zealot (zed, zjson) (#1983)
- Autofocus the query name when saving a query (#1979)

## v0.28.0

- Update Zed to [v0.33.0](https://github.com/brimdata/zed/releases/tag/v0.33.0)
- Update Auth0 authentication (#1956)
- Add Query Library folder export (#1958)
- Rename "workspace" to "lake" (#1957)
- Fix an issue where array values sometimes overlapped in the search results (#1953)
- Add file drag and drop to the Pools section (creates a new pool and imports data) and the Query Library (imports queries) (#1938)
- Fix some issues with read-only folder drag and drop in the Query Library (#1936)

## v0.27.0

- Update Zed to [v0.32.0](https://github.com/brimdata/zed/releases/tag/v0.32.0)
- Fix an issue where entering relative dates in the time range caused a crash (#1932)
- Fix an issue where selecting a large pool made the app unresponsive (#1919)
- Fix an issue where exporting data failed (#1909)
- Highlight Zed error values (#1903)
- Fix an issue where the bar chart did not stay in sync with the search results (#1897)
- Fix an issue where switching to a tab reissued its search (#1891)
- Add nested folders, library importing, and inline renaming to the Query Library (#1887)
- Improve search bar responsiveness (#1877)
- Update Brimcap to [v1.1.2](https://github.com/brimdata/brimcap/releases/tag/v1.1.2) (#1889)
- Fix an issue where records containing a type alias were not displayed properly (#1882)
- Maintain sidebar layout when switching tabs (#1873)

## v0.26.0

- Update Zed to [v0.31.0](https://github.com/brimdata/zed/releases/tag/v0.31.0)
- Brim now uses the Zed API `/query` endpoint, which allows for full use of Zed lake language features (e.g., referencing branches and pools using `from`) (#1792, #1836)
- Add a [Troubleshooting wiki entry](https://github.com/brimdata/brim/wiki/Troubleshooting#my-antivirus-software-has-flagged-brim-as-potentially-malicious) regarding the false flagging of Brim as potentially malicious by some antivirus software (#1840)
- The keyboard shortcut for "zoom in" (`Cmd+` on macOS, `Ctrl+` on Windows/Linux) no longer requires holding down the Shift key (#1842)
- Fix an issue where selecting **Delete All** in the Pools list caused a crash (#1845)
- The right-click filter option has been updated to **Filter == value** to reflect current Zed syntax (#1849)
- Fix an issue where some errors from a Brimcap analyzer failure were not being surfaced (#1850)
- Fix an issue where primitive type values were not being shown (#1852)
- Fields of the same name may now be presented under the same column header, regardless of type (#1853)
- Fix an issue where a record was incorrectly displayed twice after data import (#1854)
- Fix an issue where clicking a field of type `union` caused a crash (#1861)
- For field names that require quoting (e.g., containing spaces or dots), ensure they're correctly presented and that their names are quoted when added to a query via right-click operations (#1856)

## v0.25.0

As you can see below, there've been many changes since the last Brim GA release! Highlights include:

- The storage used by Brim to hold your logs is now a Zed lake. Though the
  introduction of Zed lakes causes no immediate change to your favorite Brim
  workflows, they unlock powerful new functionality that will be revealed in
  Brim going forward, including Git-like branching. See the
  [Zed lake README](https://github.com/brimdata/zed/blob/v0.30.0/docs/lake/README.md)
  for details.
- Enhancements have been made to the Zed language to unify search and
  expression syntax, introduce new operators and functions for data
  exploration and shaping, and more! Review the
  [Zed language docs](https://github.com/brimdata/zed/blob/v0.30.0/docs/language/README.md)
  for details.
- pcap processing is now handled by a separate, new component
  called Brimcap. Your favorite pcap workflows in Brim have not changed, but
  Brimcap also opens up new flexible custom configurations and can be used as
  a standalone tool. For more info, check out the
  Brimcap [README](https://github.com/brimdata/brimcap/blob/main/README.md)
  and [wiki](https://github.com/brimdata/brimcap/wiki).

Among the many detailed changes listed below, there're a few big ones in
particular we'd like to bring to your attention first.

- You will be prompted upon first launch of Brim `v0.25.0` to allow
  auto-migration of saved data from your `v0.24.0` Spaces to pools in Zed
  lakes.

- Brim `v0.25.0` includes a new installer that will make upgrades to future
  versions more seamless. However, when making the jump from `v0.24.0` to the
  newer release:

  - Windows users will not be prompted to auto-update as they were in the
    past. Windows users will also have to manually uninstall the old release
    before `v0.25.0` will start. Auto-update notifications for Windows will
    resume on the
    next release. See the
    [Installation](https://github.com/brimdata/brim/blob/v0.25.0/docs/Installation.md#windows-installation-v0250)
    article on the Brim wiki for details.
  - Linux users of RPM packages (such as for Red Hat-style distributions) will
    need to uninstall the older `v0.24.0` release before the RPM package for
    `v0.25.0` will successfully install. See the
    [Linux RPM Upgrade](https://github.com/brimdata/brim/wiki/Linux-RPM-Upgrade)
    article in the Brim wiki for details.

  Note that a Brim uninstall does _not_ disturb the data you've saved in
  the app. See the [Filesystem Paths](https://github.com/brimdata/brim/wiki/Filesystem-Paths)
  article in the Brim wiki for details of how Brim stores user data separately
  from app binaries.

- When upgrading to `v0.25.0`, the pre-installed entries in the Query Library
  are auto-updated to adapt to new Zed language syntax. However, if you've
  saved custom entries to the Query Library, you'll need to change these
  yourself. Some key changes include `:=` now being used for assignment, `==`
  for equality comparisons, and string values
  must now be quoted in [field/value](https://github.com/brimdata/zed/blob/v0.30.0/docs/language/search-syntax/README.md) matches.

The exhaustive set of changes is listed below. Come talk to us on
[Slack](https://www.brimdata.io/join-slack/) if you have additional
questions.

---

- Update Zed to [v0.30.0](https://github.com/brimdata/zed/releases/tag/v0.30.0)
- Make the toolbar "responsive" such that buttons hide when the window is made small (#1416, #1553)
- Add a [Troubleshooting wiki entry](https://github.com/brimdata/brim/wiki/Troubleshooting#brim-shows-connection-error-the-service-at-localhost9867-could-not-be-reached) for the case when Brim shows "Connection Error: The service at localhost:9867 could not be reached" (#1448, #1491)
- Fix an issue where the "Back" button in the **Log Detail** view was not returning to the previously-viewed record (#1447)
- Upgrade Electron dependency to 11.2.1 (#1426)
- Add wiki cookbooks for use of Zed `join` in Brim for releases `v0.24.0` and [`v0.25.0+`](https://github.com/brimdata/brim/wiki/Joining-Data) (#1430, #1729)
- Improve the error messages shown when imports fail (#1467)
- Fix an issue where the **Log Detail** pane would crash when certain named fields were missing from the target record (#1494)
- Use URLs to keep track of routing and tab history, which allows for direct edits of pinned items (#1473, #1649)
- Fix an issue where deleting a Space that was shown in the active tab would cause a crash (#1527)
- Fix an issue where navigating to a workspace that does not exist would cause a crash (#1533)
- Commas are now stripped when a numeric value is copied into the paste buffer via right-click **Copy** (#1535)
- Adjust the guidance on the **Import Files** page and add a [wiki article](https://github.com/brimdata/brim/wiki/Importing-CSV%2C-Parquet%2C-and-ZST) with more detail (#1548, #1625, #1626, #1635)
- Brim is now packaged using [electron-builder](https://www.electron.build/), which streamlines installation and auto-update (#1508)
- Fix an issue where importing an NDJSON record containing an empty object caused a "Cannot read property 'map' of null" pop-up error (#1581)
- Remove the legacy approach for applying Zed types to NDJSON input, as this is now done via Zed shapers ([docs](https://github.com/brimdata/zed/blob/v0.30.0/zeek/Shaping-Zeek-NDJSON.md)) (#1580, #1582)
- Brim now invokes [Brimcap](https://github.com/brimdata/brimcap) to generate logs from imported pcaps and to extract flows when **Packets** is clicked, rather than relying on `zqd` (#1584, #1573, #1591, #1590, #1598, #1614, #1617, #1637, #1651, #1664, #1668, #1705, #1731, #1735, #1748, #1747, #1781, #1789, #1810, #1816, #1829, #1833)
- Use pools in Zed lakes for backend storage rather than Spaces (#1589, #1601, #1633, #1676, #1696, #1710, #1712, #1772, #1822)
- Implement the full Zed type system in JavaScript, which allows for improved presentation of array and set types, and also fixes an issue where named types were rejected at import (#1603, #1623, #1663, #1732)
- Offer the option to migrate Spaces to pools when new Brim launches (#1621, #1587, #1636, #1641, #1640, #1657, #1671, #1682, #1762)
- Automatically append `| fuse` to the Zed pipeline if the user is exporting data in CSV format (#1622)
- Notify a Windows user if they've launched new Brim while old Brim is still installed (#1627, #1751)
- Update default **Query Library** entries to reflect newer Zed language syntax (#1489, #1645)
- Fix an issue where timestamps in **Log Detail** were not displayed with full precision and did not reflect current **Preferences** settings (#1643)
- Fix an issue where selecting **File > New Window** on a freshly-installed app triggered a crash (#1654)
- Show Release Notes for the currently-installed Brim version in a tab (#1655, #1670, #1679, #1680)
- Add a [wiki article](https://github.com/brimdata/brim/wiki/Linux-RPM-Upgrade) to inform Linux RPM users that their old Brim will need to be manually uninstalled before the new Brim will install (#1683)
- Fix an issue where viewing Suricata alerts in Brim could trigger a "TypeError: Cannot read property 'startsWith' of undefined" error (#1706)
- Ensure pool updates made from outside the app are reflected automatically in Brim (#1702, #1709, #1711, #1713, #1722, #1733, #1734)
- The [Brim wiki](https://github.com/brimdata/brim/wiki) now has articles for changes specific to the `v0.25.0` release, with parallel articles remaining for older Brim where functionality has changed significantly (#1723)
- Update the [Code Base Walkthrough wiki article](https://github.com/brimdata/brim/blob/v0.25.0/docs/Code-Base-Walkthrough.md) to reflect recent changes to where code lives in the repo (#1738)
- **Preferences** now has settings for a "thousands separator" and "decimal" that allow changing from `,` and `.` defaults or removing them entirely (#1740, #1765)
- Fix issues where error messages from failed imports were not being fully surfaced (#1760, #1786)
- Zed `type` values that are output in Brim are no longer wrapped with parentheses (#1757)
- Hovering over a field value now displays the Zed data type in a tooltip (#1766)
- Fix an issue where selecting a range from the time span pull-down caused a crash with unshaped data (#1777)
- On macOS, if all Brim windows are closed but the app is still running, clicking the Brim icon in the Dock now opens a new window (#1782)
- Fix an issue where numbers were being incorrectly output in scientific notation (#1787)
- Fix a memory leak that occurred during large data imports (#1793)
- Due to the deprecation of Spaces, the **Data Directory** setting has been removed from **Preferences** (#1794)
- Fix an issue where Zed type definition values could not be copied into the paste buffer (#1796)
- Add a new [section](https://github.com/brimdata/brim/wiki/Filesystem-Paths#temporary-storage) to the [Filesystem Paths](https://github.com/brimdata/brim/wiki/Filesystem-Paths) wiki article to describe how Brim and Zed use temporary storage (#1801)
- Fix an issue where "Kill search" was not halting a search in progress (#1814)

## v0.24.0

- Update zq to [v0.29.0](https://github.com/brimdata/zed/releases/tag/v0.29.0)
- Consolidate the colors used in Brim (#1405)
- Fix an issue where the arrows in the sidebar were incorrectly pointed (#1414)
- Add a wiki doc and script showing how to transfer contents of the Query Library (#1415)
- Fix an issue where data exports continued long after the "Exporting..." pop-up went away (#1424)
- Hide the archive index search dropdown (#1417)
- Fix an issue where invoking a right-click "Whois" lookup in a Log Detail window caused a stack dump (#1418)

## v0.23.0

**NOTE** - Beginning with this release, a subset of the source code in the
[github.com/brimdata/brim](https://github.com/brimdata/brim) GitHub repository is
covered by a source-available style license, the
[Polyform Perimeter License (PPL)](https://polyformproject.org/licenses/perimeter/1.0.0/).
We've moved the PPL-covered code under a `ppl/` directory in the repository.
The majority of our source code retains the existing BSD-3-Clause license.

The overwhelming majority of Brim users and developers will not be impacted
by this change, including those using Brim in commercial settings. The use of
the source-available Polyform Perimeter license prevents use cases like
marketing a work as a replacement for the Brim desktop application while using
material covered under the PPL.

In general, we are making this change to ensure technology giants can't use the
PPL-covered code to make replacement offerings of our projects. We believe
users and developers should have access to the source code for our projects,
and we need a sustainable business model to continue funding our work. Using
the source-available Polyform Perimeter license on portions of the source code
lets us realize both.

For more detail regarding licensing, see the [CONTRIBUTING.md](CONTRIBUTING.md)
doc, and feel free to come talk to us on
[Slack](https://www.brimdata.io/join-slack/) if you have additional
questions.

---

**NOTICE for users who have added custom entries to their Query Library:**

We've become aware of an issue in Brim v0.22.0 where custom entries in the Query Library will **not be saved** if you quit by closing all your Brim windows (i.e. hitting the "X" in the upper-right of the window on Windows/Linux, or clicking the "red stoplights" on macOS). They _are_ saved if you quit via the pull-down menu (**File > Exit** on Windows/Linux, **Brim > Quit Brim** on macOS). Therefore, when closing Brim in prep for the v0.23.0 upgrade, make sure you quit via pull-down menu. When you're prompted to auto-update to v0.23.0 on Windows/macOS, select the option to Restart **Later** so that way you can quit via pull-down menu. We've fixed these issues so it should not be a problem in v0.23.0 and going forward. Sorry for the inconvenience!

---

- Update zq to [v0.28.0](https://github.com/brimdata/zed/releases/tag/v0.28.0)
- Revise the [Troubleshooting doc](https://github.com/brimdata/brim/wiki/Troubleshooting) to describe the use of the **Window > Reset State** pull-down menu option (#1350)
- Fix an issue where scrolling to the bottom of the main window did not bring up additional events (#1348)
- Fix an issue with inconsistently-created pinned items in the **History** panel (#1349)
- Adjust the configuration for log generation in the embedded `zqd` (#1353)
- Fix an issue where "Restart Required" notifications in the **Preferences** screen were not fully visible (#1368)
- Fix an issue where results in the "MD5 correlation" visualization were not being updated after event tiles were clicked (#1369)
- Disable the creation of macOS filesystem tags during **Export** operations (#1370)
- Fix issues where Query Library entries were being lost when exiting/relaunching Brim (#1366, #1387)
- Add a right-click option to **Copy** field contents into the paste buffer (#1367, #1381)
- A "Connection" (such as to a [remote `zqd`](https://github.com/brimdata/brim/blob/v0.23.0/docs/Remote-zqd.md)) is now known as a "Workspace" (#1372)
- Revise the [Troubleshooting doc](https://github.com/brimdata/brim/wiki/Troubleshooting) with more detail regarding failures to open flows from pcaps (#1380)

## v0.22.0

- Add a customizable "Query Library" panel of clickable Z queries for working with Zeek and Suricata logs (#1272)
- Add the `source` field to the JSON typing config to prepare for Zeek v4.x `weird` events (#1307)
- Allow the export of query results in NDJSON and CSV formats (#1302, #1328)
- Add a correlation visualization in the Log Detail view for pivoting from a Suricata alert back to related Zeek `conn` events (#1310)
- Re-style the Log Detail panel and window (#1310)
- Ensure `_path` and `event_type` fields are always displayed directly to the right of the `ts` timestamp field (#1339)
- Pull-down menu option **Window > Reset State** now clears app state after user confirmation (#1338)
- Update zq to [v0.27.1](https://github.com/brimdata/zed/releases/tag/v0.27.1) (follow that link for details of additional changes that may affect Brim)

## v0.21.1

- Update zq to [v0.26.0](https://github.com/brimdata/zed/releases/tag/v0.26.0), which fixes an issue that was causing pcap import failures, and also delivers other enhancements

## v0.21.0

**NOTE** - The Brim v0.21.0 release includes initial support for the
automatic generation of [Suricata](https://suricata.io/) alerts from imported pcaps.
The alert records may be isolated via a ZQL search `event_type=alert` and are
also included automatically alongside relevant Zeek event context in the
correlation visualization in the Log Detail view. The Suricata build that's
packaged with Brim uses the
[Emerging Threats Open ruleset](https://rules.emergingthreats.net/OPEN_download_instructions.html),
and Brim triggers a download of the most recent set of these rules each
time it is launched.

There are two known issues found during testing that may be bugs in Suricata
that impact the correctness of the alerts seen in Brim:

- When run on a system under heavy load, Suricata has sometimes been observed to generate fewer alerts than expected (or none at all) for a given pcap.
- Alerts may be generated with timestamps that are seconds/minutes further into the future beyond the end of the time range of the flow that triggered them.

These issues are still being investigated and more information will be provided
as they're better understood. More Suricata-related functionality is also
planned in upcoming releases. For now, please
[contact us on Slack](https://brimdata.io/join-slack/) or
[open an issue](https://github.com/brimdata/brim/wiki/Troubleshooting#opening-an-issue)
if you have any questions or problems with the new Suricata support, including
incidents of the issues described above.

---

- Update zq to [v0.25.0](https://github.com/brimdata/zed/releases/tag/v0.25.0)
- Add Suricata support to generate alerts from imported pcaps (#1207)
- Include Suricata alerts in the correlation visualization in the Log Detail view (#1262)
- Update the [Supported Platforms](https://github.com/brimdata/brim/wiki/Supported-Platforms) article with detail from recent testing (#1267, #1273)
- Add a [wiki doc](https://github.com/brimdata/brim/blob/v0.23.0/docs/Remote-zqd.md) with details for using Brim with a remote `zqd` (#1222, #1252)
- Add a [wiki doc](https://github.com/brimdata/brim/wiki/Installation) with basic Brim installation guidance (#1253, #1260)
- Add a "Sectional" package in the code that allows a view to be split (#1247)
- Add a "Tree list" package in the code for working with lists (rendering, drag & drop, etc.) (#1254)
- Fix an issue where Brim would freeze during zoom-in/zoom-out (#1275)
- Fix an issue where autoupdate would install releases with version numbers "older" than the number of the one currently installed (#1244)
- Fix an issue where the Space list would come up empty and Space details would show "NAN UNDEFINED" after a Brim restart (#1283, #1288)
- Fix an issue on Windows where clicking records generated from an imported pcap produced error messages (#1287)

## v0.20.0

- Update zq to [v0.24.0](https://github.com/brimdata/zed/releases/tag/v0.24.0)
- Begin bundling the same Zeek artifact referenced in [zq's `package.json`](https://github.com/brimdata/zed/blob/main/package.json) (#1215)
- Support log imports over the network, such as to a remote `zqd` (#1195, #1228)
- Fix an issue where an excess "Space does not exist" message was shown when clicking Retry after a `zqd` restart (#1200)
- Improve the error message for failed attempts to import pcaps (#1235)
- Allow removal of remote Connection configs (#1226)
- Fix an issue where importing logs containing `null` values for nested records caused a crash (#1241)
- Add scaffolding for a future Query Library feature (#1239)
- Fix an issue where Brim sometimes failed to load on remote VM sessions (#1248)

## v0.19.0

- **NOTE** - Due to the ZNG storage format change described in the
  [`zq` v0.23.0 release notes](https://github.com/brimdata/zed/releases/tag/v0.23.0),
  when you first launch the new version of Brim, a one-time bulk background
  update of the stored data for all of your existing Spaces will automatically
  begin. If you click to access a Space while migration is in progress, an
  animated "spinner" will be visible in the right of the Search bar. Once
  migration is complete for a Space, the bar chart will be filled in and the
  first splash of events will be shown and you can begin working with your Space
  as usual.

---

- Update zq to [v0.23.0](https://github.com/brimdata/zed/releases/tag/v0.23.0)
- Update Zeek to [v3.2.1-brim4](https://github.com/brimdata/zeek/releases/tag/v3.2.1-brim4) which provides [Community ID](https://github.com/corelight/community-id-spec) generation and the latest [geolocation](https://github.com/brimdata/brim/blob/v0.19.0/docs/Geolocation.md) data (#1202)
- Binaries for `pcap`, `zapi`, and `zar` are now bundled with Brim (#1098)
- Fix an issue where Brim presented a blank white screen when it failed to initialize (#1035)
- Improve how Brim handles ZJSON responses from `zqd` (#1108)
- Upgrade to Electron v10.1.4 and WebdriverIO v6.6.7 (#1106, #1159)
- Fix an issue where accidental non-NDJSON data in an NDJSON response stream resulted in confusing error messages (#1111)
- Ensure pcap import warnings are presented to the user (#1112)
- Add an "Import complete" pop-up notification (#1134, #1185)
- Fix an issue where "Pivot to logs" was grayed out when right-clicking on an entry containing a dotted record field (#1142)
- Fix an issue where pinned entries in the History panel were sometimes inconsistently created (#1143)
- Add a "Move to Current Display" option on Windows to move Brim windows from an inaccessible external display (#1148, #1158, #1164)
- Fix an issue where executing rapid-fire queries caused excess disruptive "The user aborted a request" notifications (#1155)
- Fix an issue where launching Brim with config pointing to an inaccessible remote `zqd` caused a blank white screen (#1150, #1163)
- Allow for naming remote connections and editing their settings (#1157, #1167)
- Fix an issue where a Space couldn't be deleted if `zqd` went down during data import (#1146)
- Improve presentation of modals, such as Debug Query (#1171, #1184, #1175)
- Fix an issue on macOS where clicking the Brim dock icon opened additional windows (#1189)
- Fix an issue where opening the Log Detail window caused the main window to spin (#1196)
- Fix an issue on Windows where closing the last Brim window left lingering processes and Brim unable to start afterwards (#1205)

## v0.18.0

- Update zq to [v0.22.0](https://github.com/brimdata/zed/releases/tag/v0.22.0)
- Update Zeek to [v3.2.0-dev-brim10](https://github.com/brimdata/zeek/releases/tag/v3.2.0-dev-brim10) to take advantage of latest [geolocation](https://github.com/brimdata/brim/blob/v0.18.0/docs/Geolocation.md) data (#1096)
- Move the code base from Flow to TypeScript (#1075)
- Point to new Slack community URL https://www.brimsecurity.com/join-slack/ (#1089)
- Show a spinner if there's delays closing the "new connection" modal (#1084)
- Add a right-click option to delete all Spaces (#1078)
- Organize History entries by unique Space/Connection combination (#1078)
- Fix an issue where closing Brim after having searched a remote Space caused a "Space does not exist" error when Brim was relaunched (#1091)

## v0.17.0

- Update zq to [v0.21.0](https://github.com/brimdata/zed/releases/tag/v0.21.0)
- Update Zeek to [v3.2.0-dev-brim9](https://github.com/brimdata/zeek/releases/tag/v3.2.0-dev-brim9) to take advantage of latest [geolocation](https://github.com/brimdata/brim/blob/v0.17.0/docs/Geolocation.md) data (#1071)
- Fix an issue where abruptly killing Brim on Linux or macOS would leave behind an orphaned `zqd` process (#1031)
- Add an option for executing index searches on Archive Spaces (#1024)
- Fix an issue where right-clicking to delete a Space when the Brim window was not in focus caused an "Uncaught TypeError" (#1066)
- Enable import of nanosecond pcap files (#1069)

## v0.16.0

- Update zq to [v0.20.0](https://github.com/brimdata/zed/releases/tag/v0.20.0)
- Update Zeek to [v3.2.0-dev-brim8](https://github.com/brimdata/zeek/releases/tag/v3.2.0-dev-brim8) to take advantage of latest [geolocation](https://github.com/brimdata/brim/blob/v0.16.0/docs/Geolocation.md) data (#1033)
- Fix an issue where the Back button brought the user to the wrong place (#1011)
- Fix an issue where opening/closing a Log Detail window during pcap import canceled the import (#1015)
- Sort field names in the column chooser alphabetically (#1012)
- Add a search tool in the column chooser to find field names (#1012)
- Fix an issue where clicking a link to [ZQL docs](https://github.com/brimdata/zed/blob/v0.20.0/zql/docs/README.md) opened an unusable window (#1030)
- Expand the [wiki docs](https://github.com/brimdata/brim/wiki/Troubleshooting#ive-clicked-to-open-a-packet-capture-in-brim-but-it-failed-to-open) for troubleshooting pcap extraction issues (#1020)
- Fix an issue where the Packets button was not activating after scrolling down in the main events view (#1027)
- Add the ability to connect Brim to a remote `zqd` (#1007)

## v0.15.1

- Update zq to [v0.19.1](https://github.com/brimdata/zed/releases/tag/v0.19.1) (fixes an issue with excess characters in Space names after upgrade)
- Fix an issue where opening Log Detail as the first action in a freshly-launched Brim threw an error (#1006)

## v0.15.0

- Update zq to [v0.19.0](https://github.com/brimdata/zed/releases/tag/v0.19.0)
- Update Zeek to [v3.2.0-dev-brim7](https://github.com/brimdata/zeek/releases/tag/v3.2.0-dev-brim7) to take advantage of latest [geolocation](https://github.com/brimdata/brim/blob/v0.15.0/docs/Geolocation.md) data (#999)
- Use blue background color for clicked rows in main event view (#971)
- Fix an issue with brief white flashes during import auto-refresh (#972, #995)
- Fix an issue where double-clicking across two different rows acted like the second row had been double-clicked (#973)
- Adjust the amount of space consumed by the import progress bar (#980)
- Improve automatic Space naming during import (#984)
  - The `.brim` suffix is no longer added
  - If the presumed Space name already exists, a numeric suffix is added instead of rejecting the import due to the colliding Space name
- Add [wiki docs](https://github.com/brimdata/brim/blob/v0.15.0/docs/Zeek-Customization.md#creating-your-customized-zeek) for how to create a customized Zeek from Brim Zeek artifacts (#978)
- Fix an issue where right-click operations on field values containing backslashes produced invalid ZQL (#993, #996)
- Make links on the Import page tabbable (#997)

## v0.14.0

- Update zq to [v0.18.0](https://github.com/brimdata/zed/releases/tag/v0.18.0)
- Add [geolocation](https://github.com/brimdata/brim/blob/v0.14.0/docs/Geolocation.md) data to Zeek `conn` logs generated from imported pcaps (#959, #957, #935)
- Add developer documentation for [adding internal state migrations](https://github.com/brimdata/brim/wiki/Adding-Migrations) (#921)
- Restore the scroll position when going back to prior search results (#929)
- Add the Zealot Client for communicating with `zqd` via the REST API (#934)
- Add support documentation explaining where Brim stores debug logs (#939, #943)
- Fix an issue where records nested more than one level deep were not working correctly in Brim (#937)
- Improve the Column Chooser (#925, #953)
- Fix an issue where deleting a History entry incorrectly triggered its execution (#951)
- Expose React/Redux DevTools when in developer mode (#956)

## v0.13.1

- Ensure left panel is open by default, even on upgrades (#918)

## v0.13.0

- Update zq to [v0.17.0](https://github.com/brimdata/zed/releases/tag/v0.17.0)
- Add a "View in context" right-click option to zoom out to unfiltered data (#894)
- Rework left panel to include Space selection (#903, #857, #909, #913)
- "New version" notification on Linux now points to the Brim website download page (#914)

## v0.12.0

- Update zq to [v0.16.0](https://github.com/brimdata/zed/releases/tag/v0.16.0)

## v0.11.0

- Update zq to [v0.15.0](https://github.com/brimdata/zed/releases/tag/v0.15.0), which fixes [an issue with ZNG export](https://github.com/brimdata/brim/issues/814#issuecomment-636130351)
- Update Zeek to [v3.2.0-dev-brim3](https://github.com/brimdata/zeek/releases/tag/v3.2.0-dev-brim3), which adds [JA3](https://github.com/salesforce/ja3) and [HASSH](https://github.com/salesforce/hassh) support for pcaps imported into Brim (#861)
- Provide notification on Linux when a new Brim version is available for download (#870)

## v0.10.0

- Update zq to [v0.14.0](https://github.com/brimdata/zed/releases/tag/v0.14.0)
- Update Zeek to [v3.2.0-dev-brim2](https://github.com/brimdata/zeek/releases/tag/v3.2.0-dev-brim2), with the following platform specific changes:
  - Windows: importing pcaps is much faster than previous releases
  - macOS: importing pcaps no longer works on macOS versions prior to 10.14. (#819)
  - Linux: support importing pcapng formatted captures
- Allow processing of pcaps with a custom Zeek version (#771, #732, #807, #783, [wiki](https://github.com/brimdata/brim/blob/v0.10.0/docs/Zeek-Customization.md))
- Format timestamps as IS08601 by default, and add a **Preferences** option to change format (#766)
- Fix an issue where spaces were not deleted when quitting during pcap import (#780)
- Migrate app state (such as Search History) upon upgrading rather than clearing it, starting with upgrades from [v0.9.1](https://github.com/brimdata/brim/releases/tag/v0.9.1) (#787, #793, #782, #821, #823)
- Add a **Preferences** option to change the Data Directory location (#794)
- Allow exporting of search results to a ZNG file (#802, #827)
- Fix an issue where clicking the **Choose** buttons in the **Preferences** menu would hang the app (#816)
- Add the ability to rename a Space via right-click (#806, #831)
- Fix an issue where a JSON typing configuration could not be selected in **Preferences** (#818)
- Fix an issue where old error messages were left behind after exiting **Preferences** (#829)

## v0.9.1

- **NOTE**: Prior state such as Search History will be lost on upgrade to this version
- Update zq to [v0.13.1](https://github.com/brimdata/zed/releases/tag/v0.13.1) (#756)

## v0.9.0

- **NOTE**: Prior state such as Search History will be lost on upgrade to this version
- Update zq to [v0.13.0](https://github.com/brimdata/zed/releases/tag/v0.13.0) (#750)
- Start the [Brim wiki](https://github.com/brimdata/brim/wiki) for documentation (#660)
- Import of Zeek logs in TSV, JSON, and ZNG formats (see the [v0.24.0 docs](https://github.com/brimdata/brim/blob/v0.24.0/docs/Zeek-JSON-Import.md) for info on JSON). (#594, #720, #727, #625, #581, #643, #672, #716, #700, #717, #719, #735, #721, #729, #713)
- Support for Brim on Linux: `.deb` (#631) and `.rpm` (#636) installer packages
- Fix an issue where holding down arrow keys could freeze Brim (#670, #692)
- Allow Log Details to be popped out to a separate window by double-clicking an event or via a control at the top of Log Details panel (#651)
- Fix an issue where ZQL queries with double quotes were not escaped in right-click operations (#682)
- Fix an issue where Brim would crash when revisiting a tab for a deleted Space where a pcap had been opened (#681)
- The main search pane now auto-refreshes during pcap import to show additional Zeek logs as they're created (#713)
- Fix an issue where the Wireshark button was not active when re-opening a deleted Space (#722)
- Fix an issue where filenames containing the `#` character could not be opened in Brim (#723)
- Wrap long error messages (#728)
- Data stored by Brim is now centralized in a per-platform user data directory (#714)
- Fix an issue where Brim on Windows became unusable if every window except for "About" was closed (#737)
- Auto-update added on Windows, which will start to occur with the _next_ release after `v0.9.0` (#744)

## v0.8.0

- Update zq to [v0.11.1](https://github.com/brimdata/zed/releases/tag/v0.11.1) (fixes an issue that was causing the histogram to draw incorrectly) (#640)

## v0.7.0

- Introduce versioning of app state (**NOTE**: prior state such as Search History will be lost on upgrade to this version) (#587)
- Update zq to v0.10.0 (#605)
- Fix an issue where the first refresh during pcap load sometimes showed no events (#611)
- Fix an issue where sometimes windows were unable to be closed (#604)
- Up/down arrow keys now affect event highlighting & Log Details contents (#550)
- Use Wireshark icon in toolbar and Log Details view to open pcaps (#562)
- Enable the pcap button for any Zeek event that can be linked to a `conn` event (#562)
- Fix the "About" box link so it will open on Windows (#583)

## v0.6.0

- Update zq to v0.9.0 (#551)
- Add auto-update for MacOS (#515)
- Fix error message presentation via content-type inspection (#519)
- Add menu options for **Help > About** and **File > Settings** in Windows (#521)
- Add menu options for **File > Close Tab**, **File > Close Window**, and **File > Exit** (Windows only) (#522)
- Remove dependency on unzip executable (#525)
- Fix an issue where slices from pcap filenames containing space chars would not open (#526)
- Store pcap slices in OS temp dir rather than `Downloads` dir (#528)
- Fix an issue when clicking between multiple tabs during pcap ingest (#527)
- Maintain separate Log Details panel for each Space (#541)
- Show a warning in History panel for items from deleted Spaces (#547)
- Sign the Windows installer (#549)
- Change logging config to use the new waterfall logger in zqd (#540)
- Use a new Zeek launcher on Windows to improve error handling (#548)

## v0.5.4

- Ensure bundled zeek can run on MacOS version 10.10 and beyond. (#513)
- Update zq to v0.8.0. (#516)
- Fix an issue where a pcap slice error was not being caught. (#514)

## v0.5.3

- Update the windows zeek artifact to support pcapng. (#530)

## v0.5.2

This is the same as v0.5.1, but addresses a CI issue that stopped the creation of the Windows installer executable.

## v0.5.1

- Initial (beta) Windows release creation and support. Windows releases are currently unsigned (unlike our Mac releases). See [Microsoft Windows beta limitations](https://github.com/brimdata/brim/blob/v0.9.0/docs/Microsoft-Windows-beta-limitations.md) for details.
- Warn on close if there are still active pcap ingests.
- Fix some issues saving search history.
