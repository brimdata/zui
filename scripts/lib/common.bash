#!/usr/bin/env bash
# Source this file to take advantage of functions.

function retry_until_success {
    # Retry until a command succeeds.
    # Args:
    # First positional: Number of attempts to try.
    # Second positional: Delay in seconds between attempts.
    # Other positionals: Command "List" as described by bash(1) man
    # page. Compound commands won't work. Write logic into a function.
    # Example usage tries 5 times waiting 1 second between attempts to
    # see if a file foo exists.
    # retry_until_success 5 1 test -e foo
    local attempts=$1
    shift
    local delay=$1
    shift
    local i=0
    until "$@"
    do
        ((i++)) || true
        if ((i == attempts))
        then
            return 1
        fi
        sleep "${delay}"
    done
}

function umount_macos_ci_dimg {
    # https://github.com/brimsec/brim/issues/690
    # It's possible for hdiutil to fail with an error code, yet
    # subsequently the volume disappears. This is a function so that
    # its logic can be used with retry_until_success.
    local vol="$1"
    if [ -e "${vol}" ]
    then
        hdiutil detach "${vol}"
    fi
}
