#!/bin/sh

case $(uname -s) in
    Darwin )
        PATH=/Applications/Brim.app/Contents/Resources/app.asar.unpacked/zdeps:$PATH
        brim_dir="$HOME/Library/Application Support/Brim"
        ;;
    Linux )
        PATH=/opt/Brim/resources/app.asar.unpacked/zdeps:$PATH
        brim_dir=$HOME/.config/Brim
        ;;
    * ) # Windows
        PATH=$LOCALAPPDATA/Programs/Brim/resources/app.asar.unpacked/zdeps:$PATH
        brim_dir=$APPDATA/Brim
        ;;
esac

if [ $# -gt 1 ]; then
     echo "usage: $0 [BRIM_DATA_DIR]" >&2
     exit 1
elif [ $# = 1 ]; then
    brim_dir=$1
fi

set -e

echo "migrating lake at '$brim_dir/data/lake' to '$brim_dir/lake'"
cd "$brim_dir/data/lake"
export ZED_LAKE=$brim_dir/lake

# Sort these by decreasing modification time so we can use
# 'entry.id==... | head 1 | yield entry.name' below to determine current
# pool names.  (We can't use entry.ts for that because it reflects pool
# creation time rather than modification time.)
pools_zngs=$(ls -t pools/*.zng)

if [ -e "$ZED_LAKE" ]; then
    if ! stderr=$(zed ls 2>&1 >/dev/null); then
        exec "fatal error: 'zed ls' failed with this output: '$stderr'" >&2
        exit 1
    fi
else
    zed init
fi

ksuid_glob='???????????????????????????'
for pool_ksuid in $ksuid_glob; do
    pool_name=$(zq -f text "entry.id==ksuid('$pool_ksuid') | head 1 | yield entry.name" $pools_zngs)

    branch_count=$(zq -f text 'yield entry.name | sort | uniq | count()' $pool_ksuid/branches/*.zng)
    if [ "$branch_count" != 1 ]; then
        # Handling multiple branches without zed v0.33.0 is impractical.
        echo "skipping '$pool_name' ($pool_ksuid): found multiple ($branch_count) branches"
        continue
    fi

    if zed ls "$pool_name" >/dev/null 2>&1; then
        echo "skipping '$pool_name' ($pool_ksuid): pool name already exists in '$ZED_LAKE'"
        continue
    fi

    echo "migrating pool '$pool_name' ($pool_ksuid)"
    zed create -q -orderby ts:desc "$pool_name"
    zed load -q -use "$pool_name" $pool_ksuid/data/$ksuid_glob.zng
done
