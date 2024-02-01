#!/bin/bash

GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${GREEN}Atualizando o repositório...${NC}"
git pull

echo -e "${GREEN}Executando build...${NC}"
npm run build

echo -e "${GREEN}Iniciando a api...${NC}"
screen npm run start