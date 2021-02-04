#!/usr/bin/env python3

import sys
import os
import json
import argparse
import tempfile
import shutil

def parse_args():
    parser = argparse.ArgumentParser(description='Extract/restore Query Library entries from Brim\'s appState.json',
                                     formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--extract', '-o', help='Extract Query Library entries from appState.json into the specified output file')
    group.add_argument('--replace', '-r', help='Replace Query Library entries in appState.json with those from the specified input file')
    parser.add_argument('--statepath', '-s', help='Pathname of appState.json file', default=os.path.join('.', 'appState.json'))
    parser.add_argument('--backup', '-b', help='Backup appState.json before modifying it', action='store_false')
    return parser.parse_args()

if __name__ == '__main__':
    args = parse_args()

    if args.extract:
        with open(args.statepath, 'rt') as f:
            queries = json.load(f)['data']['globalState']['queries']
            with open(args.extract, 'wt') as q:
                json.dump(queries, q, sort_keys=True, indent=4)
                print('Successfully extracted Query Library from ' + args.statepath + ' to ' + args.extract)

    elif args.replace:
        with open(args.replace, 'rt') as q:
            queries = json.load(q)
            if args.backup:
                b = tempfile.NamedTemporaryFile(delete=False)
                print('Backing up ' + args.statepath + ' to ' + b.name)
                shutil.copyfile(args.statepath, b.name)
                b.close()
            with open(args.statepath, 'rt+') as f:
                state = json.load(f)
                state['data']['globalState']['queries'] = queries
                f.seek(0)
                json.dump(state, f)
                f.truncate()
                print('Successfully replaced the Query Library in ' + args.statepath + ' with the contents of ' + args.replace)
