#!/bin/zsh
# 用法: scripts/run.sh <名字> <提示词文件> <缓存 5m|1h> <预算美元> [系统提示词文件]
# 例:   scripts/run.sh 01-audio prompts/01-audio.md 5m 12
# 在仓库根目录运行；结果写到 runs/<名字>.json，用 scripts/metrics.py 汇总。
name=$1; pf=$2; ttl=$3; budget=$4; sys=${5:-prompts/builder_system.md}
mkdir -p runs; start=$(date +%s)
claude -p "$(cat $pf)" --model claude-fable-5-2 --permission-mode auto \
  --append-system-prompt "$(cat $sys)" \
  --settings "{\"promptCacheTtl\":\"$ttl\"}" --max-budget-usd $budget \
  --output-format json < /dev/null > runs/$name.json 2> runs/$name.err
echo "$name exit=$? wall=$(( $(date +%s)-start ))s" | tee -a runs/wall.log
