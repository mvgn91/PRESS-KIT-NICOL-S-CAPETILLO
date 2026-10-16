#!/usr/bin/env bash
# board.sh — tablero de tareas en terminal para tasks.md
# Uso: ./board.sh [start|done|block|todo <ID>]  (sin args = ver tablero)
set -euo pipefail
TASKS_FILE="$(dirname "$0")/tasks.md"

bar() { # bar <done> <total> <width>
  local d=$1 t=$2 w=${3:-16} f=0
  (( t > 0 )) && f=$(( d * w / t ))
  printf '['; for ((i=0;i<f;i++)); do printf '#'; done; for ((i=f;i<w;i++)); do printf -- '-'; done; printf ']'
}

show() {
  local phase="" pname="" total=0 done=0 prog=0 blocked=0
  echo "== PRESS-KIT · ciclo F2 =="
  while IFS= read -r line; do
    if [[ "$line" =~ ^##\ FASE\ (P[0-9])\ .* ]]; then
      [[ -n "$phase" ]] && printf '   %s %d/%d hechos\n' "$(bar "$done" "$total")" "$done" "$total"
      phase="${BASH_REMATCH[1]}"; pname="$line"; total=0; done=0; prog=0; blocked=0
      echo; echo "$pname"
    elif [[ "$line" =~ ^-\ \[(.)\]\ \*\*(F2-T[0-9]+)\*\*\ (.+) ]]; then
      local st="${BASH_REMATCH[1]}" id="${BASH_REMATCH[2]}" rest="${BASH_REMATCH[3]}"
      local title="${rest%% — *}"; total=$((total+1))
      case "$st" in
        x) done=$((done+1)); printf '  \e[32m[x]\e[0m %s %s\n' "$id" "$title" ;;
        '~') prog=$((prog+1)); printf '  \e[33m[~]\e[0m %s %s\n' "$id" "$title" ;;
        '!') blocked=$((blocked+1)); printf '  \e[31m[!]\e[0m %s %s\n' "$id" "$title" ;;
        *) printf '  [ ] %s %s\n' "$id" "$title" ;;
      esac
    fi
  done < "$TASKS_FILE"
  [[ -n "$phase" ]] && printf '   %s %d/%d hechos\n' "$(bar "$done" "$total")" "$done" "$total"
  echo
}

set_status() { # <ID> <char>
  local id=$1 ch=$2
  grep -qF -- "**$id**" "$TASKS_FILE" || { echo "ID no encontrado: $id"; exit 1; }
  sed -i -E "s/^(- \\[)[^]]*(\\] \\*\\*$id\\*\\*)/\\1$ch\\2/" "$TASKS_FILE"
  grep -qF -- "- [$ch] **$id**" "$TASKS_FILE" || { echo "ERROR: no se pudo actualizar $id"; exit 1; }
  echo "$id -> [$ch]"
}

case "${1:-}" in
  start|done|block|todo)
    [[ $# -eq 2 ]] || { echo "Uso: $0 $1 <ID>  (ej. $0 done F2-T01)"; exit 1; }
    case "$1" in start) c='~';; done) c='x';; block) c='!';; todo) c=' ';; esac
    set_status "$2" "$c" ;;
  "") show ;;
  *) echo "Uso: $0 [start|done|block|todo <ID>]"; exit 1 ;;
esac
