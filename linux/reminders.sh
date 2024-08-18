#!/bin/bash


FILE=~/.reminders_last_run
LAST_REMINDER=$(cat $FILE 2>/dev/null)
NOW=$(date +%s)

if [ "${LAST_REMINDER:-0}" -lt $((NOW - 7*24*60*60)) ]; then
	echo "$NOW" > $FILE
	printf '\t%s\n' \
		'' \
		'this is a weekly reminder' \
		'run "echo 2000000000 > '$FILE'" to disable it' \
		'' \
		'typing "ööö" updates the whole system' \
		'typing "öä xyz" searches for an application by the name "xyz"' \
		'typing "éé xyz" installs the application "xyz"' \
		''
fi
