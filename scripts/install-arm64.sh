#!/bin/bash

# INSTALAÇÃO RÁPIDA PARA ARM64 (aarch64)
echo "🚀 INSTALAÇÃO RÁPIDA - WHATSAPP BOT ARM64"
echo "========================================"

# Verificar se é ARM64
ARCH=$(uname -m)
if [ "$ARCH" != "aarch64" ]; then
    echo "❌ Este script é específico para ARM64 (aarch64)"
    echo "🔍 Sua arquitetura: $ARCH"
    echo "💡 Use o script install-vps.sh para detecção automática"
    exit 1
fi

echo "✅ ARM64 detectado - Prosseguindo com Chromium..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

# Instalar Node.js se necessário
if ! command -v node &> /dev/null; then
    echo "📦 Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Instalar Chromium
echo "🌐 Instalando Chromium..."
sudo apt install -y chromium-browser

# Criar link simbólico para compatibilidade
echo "🔗 Criando link simbólico..."
sudo ln -sf /usr/bin/chromium-browser /usr/bin/google-chrome-stable

# Instalar dependências
echo "📚 Instalando dependências..."
sudo apt install -y \
    libnss3 \
    libgconf-2-4 \
    libxss1 \
    libappindicator3-1 \
    libindicator7 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    xvfb \
    fonts-liberation

# Configurar variáveis de ambiente
echo "⚙️  Configurando variáveis..."
echo 'export CHROME_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
echo 'export DISPLAY=:99' >> ~/.bashrc
source ~/.bashrc

# Instalar PM2
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    sudo npm install -g pm2
fi

# Verificar instalação
echo ""
echo "🧪 VERIFICANDO INSTALAÇÃO:"
echo "📦 Node.js: $(node --version)"
echo "📦 NPM: $(npm --version)"
echo "🌐 Browser: $(google-chrome-stable --version 2>/dev/null || echo 'Erro ao verificar')"
echo "⚙️  PM2: $(pm2 --version)"

# Testar se o browser funciona
echo ""
echo "🧪 TESTANDO BROWSER:"
if google-chrome-stable --headless --no-sandbox --dump-dom about:blank >/dev/null 2>&1; then
    echo "✅ Browser funcionando corretamente!"
else
    echo "❌ Problema com o browser"
fi

echo ""
echo "🎉 INSTALAÇÃO CONCLUÍDA PARA ARM64!"
echo "======================================="
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. cd /caminho/para/seu/bot"
echo "2. npm install"
echo "3. npm test (verificar ambiente)"
echo "4. npm start (iniciar bot)"
echo ""
echo "🚀 PARA PRODUÇÃO:"
echo "pm2 start index.js --name whatsapp-bot"
echo "pm2 logs whatsapp-bot"
