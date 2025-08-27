class MessageFormatter {
  formatarSurebet(surebet) {
    const agora = new Date();
    const hora = agora.toLocaleTimeString("pt-BR");
    const data = agora.toLocaleDateString("pt-BR");

    return (
      `⚡ SUREBET DETECTADA!\n\n` +
      `📅 ${data} às ${hora}\n` +
      `⚽ Jogo: ${surebet.jogo}\n` +
      `💰 Odd: ${surebet.odd}\n\n` +
      `🌐 Fonte: BetEsporte.com\n` +
      `⏱️ Próxima verificação em 30s\n\n` +
      `💡 Use /stop para desativar alertas`
    );
  }

  formatarBoasVindas() {
    return (
      `✅ BEM-VINDO AO SUREBET BOT!\n\n` +
      `🎯 Você receberá alertas de SUREBETs\n` +
      `⏱️ Verificação automática a cada 30s\n` +
      `🌐 Fonte: BetEsporte.com\n\n` +
      `💡 Use /stop para desativar`
    );
  }

  formatarDespedida() {
    return (
      `👋 ALERTAS DESATIVADOS!\n\n` +
      `❌ Você parou de receber SUREBETs\n\n` +
      `💡 Use /start para reativar`
    );
  }

  formatarStatus(isMonitorando, totalUsuarios) {
    const agora = new Date().toLocaleTimeString("pt-BR");

    return (
      `📊 STATUS DO SUREBET BOT\n\n` +
      `⏰ Horário: ${agora}\n` +
      `🔍 Monitoramento: ${isMonitorando ? "✅ Ativo" : "❌ Inativo"}\n` +
      `👥 Total usuários: ${totalUsuarios}\n` +
      `🌐 Site: BetEsporte.com\n` +
      `⏱️ Intervalo: 30 segundos`
    );
  }

  formatarAjuda() {
    return (
      `🤖 SUREBET BOT - COMANDOS\n\n` +
      `📋 COMANDOS:\n` +
      `• /start - Ativar alertas\n` +
      `• /stop - Desativar alertas\n` +
      `• /status - Ver status\n` +
      `• /help - Mostrar ajuda\n\n` +
      `📊 INFORMAÇÕES:\n` +
      `• Monitora SUREBETs automaticamente\n` +
      `• Verificação a cada 30 segundos\n` +
      `• Detecção pelo indicador (x)\n\n` +
      `🌐 Site: BetEsporte.com`
    );
  }

  static criarMensagemSurebets(surebets, mudanca = false) {
    const surebetsFiltradas = surebets.filter(
      (s) => s.jogo && s.jogo.length <= 100
    );
    const quantidade = surebetsFiltradas.length;
    const agora = new Date();
    const hora = agora.toLocaleTimeString("pt-BR");
    const data = agora.toLocaleDateString("pt-BR");

    let mensagem = "";

    if (quantidade === 0) {
      mensagem =
        `📊 SUREBET BOT - ${data} ${hora}\n\n` +
        `📋 Nenhuma SUREBET encontrada no momento\n` +
        `🔍 Continuando monitoramento...`;
    } else {
      const emoji = mudanca ? "🔥" : "⚡";
      const status = mudanca ? "NOVA ATUALIZAÇÃO" : "MONITORAMENTO ATIVO";
      mensagem =
        `${emoji} SUREBET ALERT - ${status}\n` +
        `📅 ${data} às ${hora}\n\n` +
        `🎯 ${quantidade} SUREBET${quantidade > 1 ? "S" : ""} ENCONTRADA${
          quantidade > 1 ? "S" : ""
        }!\n\n`;
      surebetsFiltradas.forEach((surebet, index) => {
        mensagem +=
          `${index + 1}. 🏆 SUREBET DETECTADA\n` +
          `   📅 Data: ${surebet.data}\n` +
          `   ⏰ Hora: ${surebet.hora}\n` +
          `   ⚽ Jogo: ${surebet.jogo}\n` +
          `   💰 Odd: ${surebet.odd}\n\n`;
      });
      mensagem +=
        `\n🌐 Fonte: BetEsporte.com\n` +
        `⏱️ Próxima verificação em 30s\n\n` +
        `💡 Use /parar para desativar alertas`;
    }

    return mensagem;
  }

  static criarMensagemAjuda() {
    return (
      `🤖 SUREBET BOT - COMANDOS DISPONÍVEIS\n\n` +
      `📋 COMANDOS PRINCIPAIS:\n` +
      `• /start - Ativar monitoramento automático\n` +
      `• /stop - Desativar monitoramento\n` +
      `• /status - Ver status do bot\n` +
      `• /help - Mostrar esta ajuda\n\n` +
      `📊 INFORMAÇÕES:\n` +
      `• Monitora SUREBETs automaticamente\n` +
      `• Verificação a cada 30 segundos\n` +
      `• Detecção pelo indicador (x)\n` +
      `• Suporte a múltiplos usuários\n\n` +
      `🌐 Site: BetEsporte.com\n` +
      `⚡ Status: Ativo e funcionando!`
    );
  }

  static criarMensagemStatus(isMonitorando, totalUsuarios) {
    const agora = new Date().toLocaleTimeString("pt-BR");

    return (
      `📊 STATUS DO SUREBET BOT\n\n` +
      `⏰ Horário: ${agora}\n` +
      `🔍 Monitoramento: ${isMonitorando ? "✅ Ativo" : "❌ Inativo"}\n` +
      `👥 Total usuários: ${totalUsuarios}\n` +
      `🌐 Servidor: ✅ Online\n` +
      `📱 WhatsApp: ✅ Conectado\n\n` +
      `🎯 Site monitorado: BetEsporte.com\n` +
      `⏱️ Intervalo: 30 segundos`
    );
  }

  static criarMensagemAtivacao(jaAtivo = false) {
    if (jaAtivo) {
      return (
        `ℹ️ Você já está recebendo alertas de SUREBETs!\n\n` +
        `🔍 Monitoramento ativo\n` +
        `⏱️ Verificação a cada 30s\n\n` +
        `💡 Use /parar para desativar`
      );
    } else {
      return (
        `✅ MONITORAMENTO ATIVADO!\n\n` +
        `🎯 Você receberá alertas de SUREBETs\n` +
        `⏱️ Verificação automática a cada 30s\n` +
        `🌐 Fonte: BetEsporte.com\n\n` +
        `💡 Use /parar para desativar`
      );
    }
  }

  static criarMensagemDesativacao() {
    return (
      `✅ Você parou de receber alertas!\n\n` +
      `❌ Alertas desativados para este número\n\n` +
      `💡 Use /start para reativar`
    );
  }

  static criarMensagemUsuarios(usuarios) {
    const quantidade = usuarios.length;

    if (quantidade === 0) {
      return `👥 USUÁRIOS ATIVOS\n\n❌ Nenhum usuário ativo no momento`;
    }

    let mensagem = `👥 USUÁRIOS ATIVOS (${quantidade})\n\n`;
    usuarios.forEach((usuario, index) => {
      const numeroFormatado = usuario.substring(0, 10) + "...";
      mensagem += `${index + 1}. ${numeroFormatado}\n`;
    });

    return mensagem;
  }
}

module.exports = { MessageFormatter };
