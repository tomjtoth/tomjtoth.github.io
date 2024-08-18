#!/bin/bash

# remind users what aliases do
LAST_REMINDER=$(cat ~/.last_user_reminder 2>/dev/null)
NOW=$(date +%s)
if [ "${LAST_REMINDER:-0}" -lt $((NOW - 7*24*60*60)) ]; then
	echo "$NOW" > ~/.last_user_reminder
	printf '\t%s\n' \
		'' \
		'typing "ööö" updates the whole system' \
		'typing "öä xyz" searches for an application by the name "xyz"' \
		'typing "éé xyz" installs the application "xyz"' \
		''
fi
