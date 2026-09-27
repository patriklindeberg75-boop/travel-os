#!/usr/bin/env python3

import json
import subprocess
import sys


if sys.argv[1:] not in ([], ["--check"]):
    print("Usage: google-maps-keychain-headers.py [--check]", file=sys.stderr)
    sys.exit(2)

try:
    result = subprocess.run(
        [
            "/usr/bin/security",
            "find-generic-password",
            "-s",
            "Google Maps Demo API",
            "-a",
            "contact@axcioncapital.com",
            "-w",
        ],
        capture_output=True,
        check=True,
        timeout=25,
    )
    key = result.stdout.decode("ascii").removesuffix("\n")
    if not key or any(not 33 <= ord(character) <= 126 for character in key):
        raise ValueError
except (OSError, subprocess.SubprocessError, UnicodeError, ValueError):
    print("Google Maps credential unavailable.", file=sys.stderr)
    sys.exit(1)

if sys.argv[1:] == ["--check"]:
    print("Google Maps credential available.")
else:
    print(json.dumps({"X-Goog-Api-Key": key}))
