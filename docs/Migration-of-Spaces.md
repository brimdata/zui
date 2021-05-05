# Migration of Spaces

Starting with the planned future GA Brim release `v0.25.0`, imported data will
now be stored in "Data Pools" in a "Zed Lake" rather than "Spaces" as they were
previously.

A [design document](https://github.com/brimdata/zed/blob/main/docs/lake/design.md)
provides a thorough overview of Pools and how they work. In brief, the use of
Pools ultimately enables new functionality that was not previously possible in
Brim, including:

* Data may be incrementally added to, or deleted from, a Pool.
* Zed queries/analytics can make use of data stored across multiple Pools.
* Search indexes can be created to accelerate query performance.
* Pre-computed derived analytics can be leveraged to accelerate computations on stored data.

When upgrading to GA Brim release `v0.25.0` or newer, any data you had stored
in Spaces that you wish to continue accessing will need to be migrated to
Pools. The tooling to perform this migration is still under development. This
article serves as a resource we'll link to from the migration interface. It
will be updated further as the release `v0.25.0` is being prepared.
