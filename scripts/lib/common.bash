#!/usr/bin/env bash
# Source this file to take advantage of functions.

function retry_until_success {
    # Retry until a command succeeds.
    # Args:
    # First positional: Number of attempts to try.
    # Second positionals: Delay in seconds between attempts.
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
