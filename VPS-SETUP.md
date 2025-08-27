# CONFIGURAÇÃO PARA VPS UBUNTU 22.04 LTS

# Execute estes comandos na sua VPS após conectar via SSH

# 1. ATUALIZAR SISTEMA (recomendado para Ubuntu 22.04)

sudo apt update && sudo apt upgrade -y

# 2. INSTALAÇÃO NODE.JS 18.x (LTS recomendado para Ubuntu 22.04)

curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. INSTALAÇÃO BROWSER (detecta arquitetura automaticamente)

# Verificar arquitetura

ARCH=$(uname -m)
echo "🔍 Arquitetura detectada: $ARCH"

if [ "$ARCH" = "aarch64" ]; then
echo "🔧 ARM64 detectado - Instalando Chromium..."
sudo apt install -y chromium-browser # Criar link simbólico para compatibilidade
sudo ln -sf /usr/bin/chromium-browser /usr/bin/google-chrome-stable
echo "✅ Chromium instalado para ARM64"
elif [ "$ARCH" = "x86_64" ]; then
echo "🔧 x86_64 detectado - Instalando Chrome..."
wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /usr/share/keyrings/google-chrome-keyring.gpg
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" | sudo tee /etc/apt/sources.list.d/google-chrome.list
sudo apt update && sudo apt install -y google-chrome-stable
echo "✅ Chrome instalado para x86_64"
else
echo "❌ Arquitetura não suportada: $ARCH"
exit 1
fi

# 4. INSTALAÇÃO DE DEPENDÊNCIAS CHROME (Ubuntu 22.04 otimizado)

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

# 5. CONFIGURAR VARIÁVEIS DE AMBIENTE (Ubuntu 22.04)

echo 'export CHROME_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc
echo 'export DISPLAY=:99' >> ~/.bashrc
source ~/.bashrc

# 6. INSTALAR PM2 PARA GERENCIAMENTO

sudo npm install -g pm2

# 7. VERIFICAR INSTALAÇÕES

echo "📋 Verificando instalações..."
node --version
npm --version
google-chrome --version
pm2 --version
echo "✅ Verificação completa!"

# 6. EXECUTAR O BOT

# cd /caminho/para/seu/bot

# npm install

# pm2 start index.js --name whatsapp-bot

# 7. COMANDOS ÚTEIS PM2

# pm2 status - Ver status dos processos

# pm2 logs - Ver logs em tempo real

# pm2 restart all - Reiniciar todos os processos

# pm2 stop all - Parar todos os processos

# pm2 delete all - Deletar todos os processos

# 8. CONFIGURAR FIREWALL (se necessário)

# sudo ufw allow 3000

# sudo ufw allow 7000

# 9. PARA DEBUGGAR PROBLEMAS

# google-chrome --version

# which google-chrome

# echo $CHROME_PATH
