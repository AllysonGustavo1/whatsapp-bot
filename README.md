# 🤖 WhatsApp Automation Bot

> Sistema de automação para WhatsApp com funcionalidades para apostas esportivas

## 🎯 Funcionalidades

- ✅ **Monitoramento Automático**: Verificação em tempo real de apostas
- ✅ **Detecção de Mudanças**: Alertas quando odds são atualizadas
- ✅ **WhatsApp Integration**: Notificações instantâneas via WhatsApp
- ✅ **Multi-usuário**: Suporte a múltiplos usuários simultâneos
- ✅ **Comandos Interativos**: Sistema de comandos via chat
- ✅ **Arquitetura Extensível**: Fácil adição de novas funcionalidades

## � Instalação

### Pré-requisitos

- Node.js 16+
- Chrome/Chromium instalado
- WhatsApp Web

### 1. Clone o repositório

```bash
git clone https://github.com/AllysonGustavo1/whatsapp-bot.git
cd whatsapp-bot
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure os dados

```bash
# Copie o arquivo de exemplo
cp data/usuarios_ativos.example.json data/usuarios_ativos.json
```

### 4. Execute o bot

```bash
npm start
```

## 📱 Comandos do WhatsApp

| Comando   | Descrição             |
| --------- | --------------------- |
| `/start`  | Ativar alertas        |
| `/stop`   | Desativar alertas     |
| `/status` | Ver status do sistema |
| `/help`   | Mostrar ajuda         |

## 📁 Estrutura do Projeto

```
📦 whatsapp-bot/
├── 📁 src/
│   ├── 📁 core/           # Componentes principais
│   ├── 📁 services/       # Serviços (WhatsApp, APIs)
│   └── 📁 utils/          # Utilitários
├── 📁 config/             # Configurações
├── 📁 data/               # Dados dos usuários
├── index.js               # Entrada principal
└── package.json
```

## ⚙️ Configuração

As configurações estão em `config/config.js`:

```javascript
module.exports = {
  surebet: {
    intervalCheck: 30000, // Intervalo de verificação (30s)
    pageLoadTimeout: 15000, // Timeout de carregamento
    // ... outras configurações
  },
};
```

## 🔧 Funcionalidades Técnicas

- **Monitoramento em Paralelo**: Verificações não bloqueiam comandos
- **Detecção de Mudanças**: Sistema inteligente para detectar atualizações
- **Histórico de Odds**: Mantém histórico para comparações
- **Filtros Inteligentes**: Sistema de filtros para apostas relevantes
- **Auto-limpeza**: Remove dados antigos automaticamente

## 📊 Logs

O sistema produz logs detalhados:

```
🎯 SUREBET BOT v2.1 - SISTEMA FUNCIONAL
✅ Detecção de SUREBETs confirmada
📱 Envio para usuários ativos
🔧 Sistema simplificado e robusto
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## � Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🚨 Aviso Legal

Este bot é para fins educacionais e de automação pessoal. Use com responsabilidade e de acordo com os termos de serviço das plataformas utilizadas.
node index.js

```

### 3. Conectar WhatsApp
1. Escaneie o QR Code que aparecerá no terminal
2. Aguarde confirmação de conexão

### 4. Comandos no WhatsApp
- `/auto betesporte` - Ativar alertas
- `/parar` - Desativar alertas
- `/status` - Ver status do bot
- `/help` - Lista de comandos

## ⚙️ Configurações

Todas as configurações estão centralizadas em `config/config.js`:

- **Intervalo de verificação**: 30 segundos
- **Timeout de página**: 15 segundos
- **Indicadores de SUREBET**: "(x)"
- **Porta do servidor**: 3000

## 📊 APIs Disponíveis

### Health Check
```

GET /health

```

### Enviar Mensagem
```

POST /send-list
Content-Type: application/json

{
"mensagem": "Sua mensagem aqui"
}

````

## 🔧 Scripts Disponíveis

```bash
npm start           # Iniciar sistema refatorado
npm run dev         # Modo desenvolvimento
npm run server      # Apenas servidor
npm run detector    # Apenas detector
npm run legacy-server   # Servidor antigo
npm run legacy-detector # Detector antigo
npm test            # Testar Node.js
npm run clean       # Limpar e reinstalar
````

## 📈 Melhorias da v2.0

### 🏗️ Arquitetura

- **Modular**: Código organizado em módulos específicos
- **Configurável**: Configurações centralizadas
- **Escalável**: Fácil adição de novos recursos
- **Manutenível**: Separação clara de responsabilidades

### ⚡ Performance

- **Assíncrono**: Sistema não-bloqueante
- **Otimizado**: Timeouts reduzidos
- **Eficiente**: Sem geração de arquivos desnecessários

### 🛡️ Robustez

- **Tratamento de Erros**: Melhor handling de exceções
- **Reconexão**: Sistema automático de reconexão
- **Persistência**: Dados salvos automaticamente

## 🆚 Compatibilidade

- **v2.0**: Sistema refatorado (recomendado)
- **v1.0**: Arquivos legados mantidos (`server.js`, `bot.js`)

## 📚 Documentação Completa

Veja a pasta `docs/` para documentação detalhada:

- Guias de uso
- Explicações técnicas
- Histórico de mudanças

## 🎉 Pronto para Produção!

O sistema está completamente funcional e otimizado para uso em produção.

---

**Desenvolvido com ❤️ para detecção automática de SUREBETs**
