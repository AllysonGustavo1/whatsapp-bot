#!/bin/bash

# SOLUÇÃO RÁPIDA PARA O ERRO ARM64
echo "🔧 CORREÇÃO RÁPIDA ARM64 - CHROMIUM"
echo "=================================="

# Remover repositório Chrome que não funciona em ARM64
sudo rm -f /etc/apt/sources.list.d/google-chrome.list

# Instalar Chromium
echo "📦 Instalando Chromium..."
sudo apt update
sudo apt install -y chromium-browser

# Criar link simbólico para compatibilidade
echo "🔗 Criando link simbólico..."
sudo ln -sf /usr/bin/chromium-browser /usr/bin/google-chrome-stable

# Verificar instalação
echo "🧪 Testando..."
if google-chrome-stable --version; then
    echo "✅ SUCCESS! Browser instalado:"
    google-chrome-stable --version
else
    echo "❌ Ainda há problemas"
fi

echo ""
echo "🎉 PRONTO! Agora execute:"
echo "cd ~/whatsapp-bot"
echo "npm start"
