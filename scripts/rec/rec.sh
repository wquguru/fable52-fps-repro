#!/bin/zsh
# usage: rec.sh <url> <frames_dir> <W> <H> <nframes>
URL=$1; F=$2; W=$3; H=$4; N=$5; export AGENT_BROWSER_SESSION=rec04
mkdir -p $F; rm -f $F/f*.png(N)
agent-browser set viewport $W $H 1 >/dev/null; agent-browser open "$URL" >/dev/null; agent-browser wait 9000 >/dev/null
agent-browser eval "$(cat $(dirname $0)/auto04.js)"
i=0; while [ $i -lt $N ]; do json="["; for k in $(seq 1 30); do json+="[\"eval\",\"window.__frame()\"],[\"screenshot\",\"$F/f$(printf %05d $i).png\"],"; i=$((i+1)); done; echo "${json%,}]" | agent-browser batch --bail >/dev/null || break; done
echo "frames $i $(agent-browser eval 'JSON.stringify(__dbg.st())')"
