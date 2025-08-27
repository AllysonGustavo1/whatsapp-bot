#!/bin/bash

echo "🚀 INSTALAÇÃO AUTOMÁTICA - WHATSAPP BOT VPS UBUNTU 22.04"
echo "========================================================="

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para logs coloridos
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Verificar se é Ubuntu 22.04
if [ -f /etc/os-release ]; then
    . /etc/os-release
    log_info "Detectado: $NAME $VERSION"
    
    if [[ "$VERSION_ID" == "22.04" ]]; then
        log_success "Ubuntu 22.04 LTS - Versão totalmente suportada!"
    else
        log_warning "Detectado $NAME $VERSION - Script otimizado para Ubuntu 22.04"
    fi
else
    log_warning "Não foi possível detectar a versão do OS"
fi

# Verificar se é Ubuntu/Debian
if ! command -v apt &> /dev/null; then
    log_error "Este script é para sistemas Ubuntu/Debian"
    exit 1
fi

log_info "Atualizando sistema..."
sudo apt update && sudo apt upgrade -y

log_info "Instalando dependências básicas..."
sudo apt install -y \
    wget \
    gnupg \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    curl \
    git

# Instalar Node.js se não estiver instalado
if ! command -v node &> /dev/null; then
    log_info "Instalando Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
else
    log_success "Node.js já instalado: $(node --version)"
fi

# Instalar Google Chrome (método atualizado para Ubuntu 22.04)
log_info "Instalando Google Chrome..."
if ! command -v google-chrome &> /dev/null; then
    wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg
    echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
    sudo apt update
    sudo apt install -y google-chrome-stable
    
    if command -v google-chrome &> /dev/null; then
        log_success "Chrome instalado: $(google-chrome --version)"
    else
        log_error "Falha ao instalar Chrome"
        exit 1
    fi
else
    log_success "Chrome já instalado: $(google-chrome --version)"
fi

# Instalar dependências adicionais para headless (Ubuntu 22.04 otimizado)
log_info "Instalando dependências headless..."
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

# Verificar se PM2 está instalado
if ! command -v pm2 &> /dev/null; then
    log_info "Instalando PM2 para gerenciamento de processos..."
    sudo npm install -g pm2
    log_success "PM2 instalado"
else
    log_success "PM2 já instalado"
fi

# Configurar variáveis de ambiente
log_info "Configurando variáveis de ambiente..."
echo 'export CHROME_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
echo 'export DISPLAY=:99' >> ~/.bashrc
source ~/.bashrc

log_success "Instalação completa para Ubuntu 22.04!"
echo ""
log_info "🧪 Para testar a instalação:"
echo "bash scripts/test-ubuntu22.sh"
echo ""
log_info "📋 Próximos passos:"
echo "1. Navegue até a pasta do seu bot"
echo "2. Execute: npm install"
echo "3. Execute: npm test (para verificar ambiente)"
echo "4. Execute: npm start"
echo ""
log_info "🚀 Para usar PM2 (recomendado para produção):"
echo "pm2 start index.js --name whatsapp-bot"
echo "pm2 status"
echo "pm2 logs whatsapp-bot"
echo ""
log_warning "🔒 Lembre-se de configurar seu firewall se necessário!"
log_info "sudo ufw allow 3000 && sudo ufw allow 7000"
