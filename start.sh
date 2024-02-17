#!/bin/bash

REPOSITORIO="origin"
BRANCH="main"
TEMPO_ESPERA=5
PRIMEIRA_EXECUCAO=true

if [ -f ".env" ]; then
    source .env
else
    echo "Erro: está faltando o arquivo .env"
    exit 1
fi

parar_processo_anterior() {
    PIDS=$(lsof -ti :"$SERVER_PORT")

    if [ -n "$PIDS" ]; then
        kill -15 $PIDS
        sleep 5

        PIDS=$(lsof -ti :"$SERVER_PORT")
        if [ -n "$PIDS" ]; then
            echo "Parando à força processos na porta $SERVER_PORT..."
            kill -9 $PIDS
            wait $PIDS 2>/dev/null
        fi
    fi
}

iniciar_novo_processo() {
    PRIMEIRA_EXECUCAO=false
    
    echo "Parando processos anteriores na porta $SERVER_PORT..."
    parar_processo_anterior

    echo "Executando build..."
    npm run build

    echo "Iniciando a API..."
    npm run start &
}

while true; do
    git fetch "$REPOSITORIO"

    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse "$REPOSITORIO/$BRANCH")

    if [ "$LOCAL" != "$REMOTE" ]; then
        echo "Atualizando o repositório..."
        git submodule init
        git submodule update
        git pull "$REPOSITORIO" "$BRANCH"

        iniciar_novo_processo
    else
        if [ "$PRIMEIRA_EXECUCAO" = true ]; then
            iniciar_novo_processo
        fi
    fi

    sleep "$TEMPO_ESPERA"
done