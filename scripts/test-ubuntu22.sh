#!/bin/bash

# Script de teste específico para Ubuntu 22.04
echo "🧪 TESTE ESPECÍFICO UBUNTU 22.04 LTS"
echo "===================================="

# Verificar versão do Ubuntu
if [ -f /etc/os-release ]; then
    . /etc/os-release
    echo "📋 OS: $NAME $VERSION"
    
    if [[ "$VERSION_ID" == "22.04" ]]; then
        echo "✅ Ubuntu 22.04 LTS detectado"
    else
        echo "⚠️  Detectado: $NAME $VERSION (pode funcionar, mas otimizado para 22.04)"
    fi
else
    echo "❓ Não foi possível detectar a versão do OS"
fi

# Verificar arquitetura
echo "💻 Arquitetura: $(uname -m)"

# Testar Node.js
echo ""
echo "📦 TESTANDO NODE.JS:"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
    
    # Verificar se é versão LTS recomendada
    if [[ "$NODE_VERSION" == v18* ]] || [[ "$NODE_VERSION" == v20* ]]; then
        echo "✅ Versão LTS recomendada"
    else
        echo "⚠️  Recomendado: Node.js 18.x ou 20.x LTS"
    fi
else
    echo "❌ Node.js não instalado"
fi

# Testar NPM
if command -v npm &> /dev/null; then
    echo "✅ NPM: $(npm --version)"
else
    echo "❌ NPM não instalado"
fi

# Testar Chrome
echo ""
echo "🌐 TESTANDO CHROME:"
if command -v google-chrome &> /dev/null; then
    CHROME_VERSION=$(google-chrome --version)
    echo "✅ Chrome: $CHROME_VERSION"
    
    # Verificar executável
    if [ -f "/usr/bin/google-chrome-stable" ]; then
        echo "✅ Executável encontrado: /usr/bin/google-chrome-stable"
    else
        echo "❌ Executável não encontrado em /usr/bin/google-chrome-stable"
    fi
else
    echo "❌ Google Chrome não instalado"
    echo "💡 Execute: sudo apt install -y google-chrome-stable"
fi

# Testar dependências essenciais
echo ""
echo "📚 TESTANDO DEPENDÊNCIAS:"
DEPS=("libnss3" "libxss1" "libgconf-2-4" "libappindicator3-1" "libgtk-3-0")

for dep in "${DEPS[@]}"; do
    if dpkg -l | grep -q "^ii.*$dep"; then
        echo "✅ $dep"
    else
        echo "❌ $dep - faltando"
    fi
done

# Testar PM2
echo ""
echo "⚙️  TESTANDO PM2:"
if command -v pm2 &> /dev/null; then
    echo "✅ PM2: $(pm2 --version)"
else
    echo "❌ PM2 não instalado"
    echo "💡 Execute: sudo npm install -g pm2"
fi

# Testar variáveis de ambiente
echo ""
echo "🌍 TESTANDO VARIÁVEIS:"
if [ -n "$CHROME_PATH" ]; then
    echo "✅ CHROME_PATH: $CHROME_PATH"
else
    echo "⚠️  CHROME_PATH não definida"
    echo "💡 Execute: echo 'export CHROME_PATH=/usr/bin/google-chrome-stable' >> ~/.bashrc"
fi

# Testar memória disponível
echo ""
echo "💾 RECURSOS DO SISTEMA:"
MEMORY=$(free -h | awk '/^Mem:/ {print $2}')
echo "📊 Memória Total: $MEMORY"

# Verificar se tem memória suficiente (recomendado: pelo menos 1GB)
MEMORY_MB=$(free -m | awk '/^Mem:/ {print $2}')
if [ "$MEMORY_MB" -ge 1024 ]; then
    echo "✅ Memória suficiente para o bot"
else
    echo "⚠️  Memória baixa (recomendado: 1GB+)"
fi

# Espaço em disco
DISK_FREE=$(df -h / | awk 'NR==2 {print $4}')
echo "💿 Espaço livre: $DISK_FREE"

echo ""
echo "🎯 RESUMO DO TESTE:"
echo "=================================="

# Contar sucessos
SUCCESS_COUNT=0
TOTAL_TESTS=7

command -v node &> /dev/null && ((SUCCESS_COUNT++))
command -v npm &> /dev/null && ((SUCCESS_COUNT++))
command -v google-chrome &> /dev/null && ((SUCCESS_COUNT++))
[ -f "/usr/bin/google-chrome-stable" ] && ((SUCCESS_COUNT++))
command -v pm2 &> /dev/null && ((SUCCESS_COUNT++))
dpkg -l | grep -q "^ii.*libnss3" && ((SUCCESS_COUNT++))
dpkg -l | grep -q "^ii.*libgtk-3-0" && ((SUCCESS_COUNT++))

echo "📊 Testes passados: $SUCCESS_COUNT/$TOTAL_TESTS"

if [ "$SUCCESS_COUNT" -eq "$TOTAL_TESTS" ]; then
    echo "🎉 TODOS OS TESTES PASSARAM!"
    echo "✅ Seu Ubuntu 22.04 está pronto para o WhatsApp Bot!"
elif [ "$SUCCESS_COUNT" -ge 5 ]; then
    echo "⚠️  QUASE PRONTO - alguns itens precisam de atenção"
else
    echo "❌ PROBLEMAS DETECTADOS - siga o VPS-SETUP.md"
fi

echo ""
echo "📋 Para instalar tudo automaticamente:"
echo "bash scripts/install-vps.sh"
