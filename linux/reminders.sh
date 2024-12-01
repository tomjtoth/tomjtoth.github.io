#!/bin/bash


FILE=~/.reminders_last_run
LAST_REMINDER=$(cat $FILE 2>/dev/null)
NOW=$(date +%s)

if [ "${LAST_REMINDER:-0}" -lt $((NOW - 7*24*60*60)) ]; then
	echo "$NOW" > $FILE
	printf '\t%s\n' \
		'' \
		'this is a weekly reminder' \
		'run the below command to disable it:' \
		'' \
		'  sed -E "s/^(source .+\/reminders.sh\))$/# \1/g" ~/.bashrc' \
		'' \
		'typing "ööö" updates the whole system' \
		'typing "öä xyz" searches for an application by the name "xyz"' \
		'typing "öäå xyz" searches for an unofficial application by the name "xyz"' \
		'typing "öö xyz" installs the application "xyz"' \
		'typing "ör xyz" removes the application "xyz"' \
		''
fi
