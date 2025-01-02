#!/bin/bash


LAST_ACTIVITY=$(stat -c %Y ~/.bash_history)
NOW=$(date +%s)
DAYS=7

if [ "${LAST_ACTIVITY:-0}" -lt $((NOW - DAYS*24*60*60)) ]; then
	printf '\t%s\n' \
		'' \
		"this reminder is shown, when not issuing any commands for ${DAYS} days" \
		'and can be disabled via running: "öreminders"' \
		'' \
		'typing "ööö" updates the whole system' \
		'typing "öä xyz" searches for an officially supported app by the name "xyz"' \
		'typing "öäå xyz" searches for any (also unofficially supported) app by the name "xyz"' \
		'typing "öö x1 x2 x3" installs the apps "x1", "x2", "x3"' \
		'typing "ör xyz" removes the application "xyz"' \
		''
fi
