#!/bin/bash

# Remover arquivos da implementação antiga
rm -rf src/app/clients
rm -rf src/app/nucleo-gestao/clients/[id]/edit

# Atualizar a estrutura do diretório nucleo-gestao
mkdir -p src/app/(authenticated)/nucleo-gestao/clients

# Mover os arquivos para a nova estrutura
mv src/app/nucleo-gestao/clients/page.tsx src/app/(authenticated)/nucleo-gestao/clients/

echo "Arquivos antigos removidos e estrutura atualizada com sucesso!"