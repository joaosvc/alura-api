#!/bin/bash

REPOSITORIO="origin"
BRANCH="main"
TEMPO_ESPERA=5
PRIMEIRA_EXECUCAO=true

parar_processo_anterior() {
    PID_ANTIGO=$(pgrep -f "npm run start")

    if [ -n "$PID_ANTIGO" ]; then
        echo "Parando processo anterior (PID: $PID_ANTIGO)..."
        kill "$PID_ANTIGO"
        wait "$PID_ANTIGO" 2>/dev/null
    fi
}

iniciar_novo_processo() {
    PRIMEIRA_EXECUCAO=false

    echo "Executando build..."
    npm run build

    parar_processo_anterior

    echo "Iniciando a API..."
    npm run start &
}

while true; do
    git fetch "$REPOSITORIO"

    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse "$REPOSITORIO/$BRANCH")

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Atualizando o repositório..."
        git pull "$REPOSITORIO" "$BRANCH"

        iniciar_novo_processo
    else
        if [ "$PRIMEIRA_EXECUCAO" = true ]; then
            iniciar_novo_processo
        fi
    fi

    sleep "$TEMPO_ESPERA"
done