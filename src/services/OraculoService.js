const { preverSurebets } = require("../core/BetEsporteAPI");

class OraculoService {
  constructor() {
    this.ativo = false;
    this.intervalId = null;
    this.visoesEncontradas = new Set();
    this.contadorConsultas = 0;
    this.whatsappClient = null;
    this.usuariosVIP = [];
  }

  setWhatsAppClient(client) {
    this.whatsappClient = client;
  }

  setUsuariosVIP(usuarios) {
    this.usuariosVIP = usuarios;
  }

  async iniciar() {
    if (this.ativo) {
      console.log("🔮 Oráculo já está ativo");
      return;
    }

    this.ativo = true;
    this.visoesEncontradas.clear();
    this.contadorConsultas = 0;

    console.log("🔮✨ ORÁCULO DAS SUREBETS INICIADO ✨🔮");
    console.log("═".repeat(50));
    console.log("🌟 Iniciando consulta à bola de cristal...");
    console.log("⚡ Delay: 10s entre jogos, 60s entre ciclos");
    console.log('🎯 Buscando energias locked nos mercados "Total"');
    console.log("💎 (Mais de 1.5, 2.5, 3.5 com locked: true)");
    console.log("═".repeat(50));

    // Primeira consulta imediata
    await this.consultarOraculo();

    // Configurar intervalo de 60 segundos
    this.intervalId = setInterval(() => {
      this.consultarOraculo();
    }, 60000);
  }

  async parar() {
    if (!this.ativo) {
      console.log("🔮 Oráculo já está parado");
      return;
    }

    this.ativo = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log("\n🌟 Encerrando consulta ao oráculo...");
    console.log("╔" + "═".repeat(50) + "╗");
    console.log(
      `║ 📊 Total de consultas realizadas: ${this.contadorConsultas
        .toString()
        .padStart(12)} ║`
    );
    console.log(
      `║ 🎯 Total de visões únicas: ${this.visoesEncontradas.size
        .toString()
        .padStart(18)} ║`
    );
    console.log("╚" + "═".repeat(50) + "╝");
    console.log("🔮✨ A bola de cristal descansa... Até a próxima! ✨🔮");
  }

  async consultarOraculo() {
    this.contadorConsultas++;
    const agora = new Date();
    const timestamp = agora.toLocaleString("pt-BR");

    console.log(
      `\n🔮 [${timestamp}] CONSULTA MÍSTICA #${this.contadorConsultas}`
    );
    console.log("╔" + "═".repeat(58) + "╗");
    console.log(
      "║" + " ".repeat(20) + "🌟 VIDENTE EM AÇÃO 🌟" + " ".repeat(17) + "║"
    );
    console.log("╚" + "═".repeat(58) + "╝");

    try {
      const surebets = await preverSurebets();

      if (surebets.length > 0) {
        console.log(
          `\n✨ A BOLA DE CRISTAL REVELA ${surebets.length} VISÃO(ÕES) PROFÉTICA(S)! ✨`
        );

        for (const surebet of surebets) {
          const jogoId = `${surebet.homeTeam}_vs_${surebet.awayTeam}_${surebet.data}`;

          if (!this.visoesEncontradas.has(jogoId)) {
            this.visoesEncontradas.add(jogoId);

            console.log("\n🔮⚡ NOVA PROFECIA REVELADA! ⚡🌟");
            console.log("┌" + "─".repeat(60) + "┐");
            console.log(
              `│ 🔮 Visão: ${surebet.homeTeam} vs ${surebet.awayTeam}`
            );
            console.log(
              `│ 🏟️  Reino: ${surebet.tournament} (${surebet.country})`
            );
            console.log(
              `│ ⏰ Momento Profético: ${new Date(surebet.data).toLocaleString(
                "pt-BR"
              )}`
            );
            console.log(`│ 🌟 Energias Locked Detectadas:`);

            surebet.mercadosLocked.forEach((mercado) => {
              console.log(
                `│    ✨ ${mercado.mercado} - ${mercado.opcao} (Força: ${mercado.odd})`
              );
            });

            console.log("└" + "─".repeat(60) + "┘");
            console.log(
              "🚨 ALERTA MÍSTICO: A bola de cristal brilha intensamente!"
            );
            console.log("💫 As energias convergem para uma possível surebet!");

            // Enviar para usuários VIP
            await this.enviarVisaoParaVIPs(surebet);
          }
        }
      } else {
        console.log(
          "🌫️  A bola de cristal está nebulosa... Nenhuma visão clara encontrada."
        );
        console.log(
          "💭 As energias dos mercados estão em harmonia por agora..."
        );
      }

      console.log(
        `\n🔮 Aguardando 60 segundos para próxima consulta ao oráculo...`
      );
      console.log("💫 As estrelas se alinham para a próxima visão...");
    } catch (error) {
      console.error("⚡ INTERFERÊNCIA MÍSTICA DETECTADA:", error.message);
      console.log(
        "🌪️  As energias estão instáveis... Tentando novamente em 60s..."
      );
    }
  }

  async enviarVisaoParaVIPs(surebet) {
    if (!this.whatsappClient || this.usuariosVIP.length === 0) {
      console.log("📱 WhatsApp não conectado ou nenhum usuário VIP disponível");
      return;
    }

    const horarioDeteccao = new Date().toLocaleString("pt-BR");
    const dataJogo = new Date(surebet.data).toLocaleString("pt-BR");

    // Formatando a lista de mercados locked
    let mercadosTexto = "";
    surebet.mercadosLocked.forEach((mercado, index) => {
      mercadosTexto += `🎯 ${mercado.mercado} - ${mercado.opcao} (Odd: ${mercado.odd})`;
      if (index < surebet.mercadosLocked.length - 1) {
        mercadosTexto += "\n";
      }
    });

    const mensagem =
      `🔮✨ VISÃO PROFÉTICA DETECTADA! ✨🔮\n\n` +
      `⚽ Jogo: ${surebet.homeTeam} vs ${surebet.awayTeam}\n` +
      `🏟️ Torneio: ${surebet.tournament} (${surebet.country})\n` +
      `⏰ Data: ${dataJogo}\n` +
      `🕐 Detectado em: ${horarioDeteccao}\n\n` +
      `🌟 ENERGIAS LOCKED DETECTADAS:\n` +
      `${mercadosTexto}\n\n` +
      `🚨 ALERTA MÍSTICO: As energias convergem para uma possível surebet!\n` +
      `💫 A bola de cristal brilha intensamente!`;

    // Enviar para todos os usuários VIP
    for (const usuario of this.usuariosVIP) {
      try {
        await this.whatsappClient.sendText(usuario, mensagem);
        console.log(
          `🔮 Visão profética enviada para VIP ${usuario.substring(
            0,
            15
          )}... ✅`
        );
        // Delay entre envios
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        console.error(
          `❌ Erro ao enviar visão para VIP ${usuario.substring(0, 15)}...:`,
          error.message
        );
      }
    }
  }

  estaAtivo() {
    return this.ativo;
  }

  getStatus() {
    return {
      ativo: this.ativo,
      consultas: this.contadorConsultas,
      visoesUnicas: this.visoesEncontradas.size,
      usuariosVIP: this.usuariosVIP.length,
    };
  }
}

module.exports = { OraculoService };
