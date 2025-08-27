const { buscarSurebetsBetEsporte } = require("./src/core/BetEsporteAPI");
const { WhatsAppService } = require("./src/services/WhatsAppService");
const { MessageFormatter } = require("./src/utils/MessageFormatter");
const config = require("./config/config");
const fs = require("fs");

console.log("🎯 SUREBET BOT v2.1 - SISTEMA FUNCIONAL");
console.log("✅ Detecção de SUREBETs confirmada");
console.log("📱 Envio para usuários ativos");
console.log("🔧 Sistema simplificado e robusto");
console.log("=".repeat(50));

let whatsappClient = null;
let monitorandoAtivo = false;
let intervalId = null;

let historicoSurebets = new Map();
const mensagensEnviadasPorUsuario = {};

function criarIdentificadorSurebet(surebet) {
  return `${surebet.nome}|${surebet.mercado}|${surebet.optionName}`;
}

function gerarHashSurebet(surebet) {
  return `${surebet.nome}|${surebet.odd}|${surebet.mercado}|${surebet.optionName}`;
}

function carregarUsuarios() {
  try {
    const dados = fs.readFileSync("./data/usuarios_ativos.json", "utf8");
    const usuarios = JSON.parse(dados);
    console.log(`👥 ${usuarios.length} usuário(s) carregados`);
    return usuarios;
  } catch (error) {
    console.error("❌ Erro ao carregar usuários:", error.message);
    return [];
  }
}

function salvarUsuarios(usuarios) {
  try {
    fs.writeFileSync(
      "./data/usuarios_ativos.json",
      JSON.stringify(usuarios, null, 2)
    );
    console.log(`💾 Usuários salvos: ${usuarios.length}`);
  } catch (error) {
    console.error("❌ Erro ao salvar usuários:", error.message);
  }
}

function adicionarUsuario(userId) {
  const usuarios = carregarUsuarios();
  if (!usuarios.includes(userId)) {
    usuarios.push(userId);
    salvarUsuarios(usuarios);
    console.log(`✅ Usuário adicionado: ${userId.substring(0, 15)}...`);
    return true;
  }
  console.log(`ℹ️ Usuário já existe: ${userId.substring(0, 15)}...`);
  return false;
}

function removerUsuario(userId) {
  const usuarios = carregarUsuarios();
  const index = usuarios.indexOf(userId);
  if (index > -1) {
    usuarios.splice(index, 1);
    salvarUsuarios(usuarios);
    console.log(`✅ Usuário removido: ${userId.substring(0, 15)}...`);
    return true;
  }
  console.log(`ℹ️ Usuário não encontrado: ${userId.substring(0, 15)}...`);
  return false;
}

async function handleMessage(message) {
  try {
    const userId = message.from;
    const texto = message.body.toLowerCase().trim();

    console.log(`📨 Mensagem de ${userId.substring(0, 15)}...: ${texto}`);

    if (!whatsappClient) {
      console.log("⚠️ WhatsApp não conectado - comando ignorado");
      return;
    }

    const messageFormatter = new MessageFormatter();
    let resposta = "";

    // Processar comandos
    if (texto === "/start" || texto === "iniciar" || texto === "start") {
      const adicionado = adicionarUsuario(userId);
      resposta = adicionado
        ? messageFormatter.formatarBoasVindas()
        : "ℹ️ Você já está recebendo alertas de SUREBETs!";
    } else if (texto === "/stop" || texto === "parar" || texto === "stop") {
      const removido = removerUsuario(userId);
      resposta = removido
        ? messageFormatter.formatarDespedida()
        : "ℹ️ Você não estava recebendo alertas.";
    } else if (texto === "/status" || texto === "status") {
      const usuarios = carregarUsuarios();
      resposta = messageFormatter.formatarStatus(
        monitorandoAtivo,
        usuarios.length
      );
    } else if (texto === "/help" || texto === "ajuda" || texto === "help") {
      resposta = messageFormatter.formatarAjuda();
    } else {
      // Mensagem padrão para comandos não reconhecidos
      resposta =
        "🤖 Comandos disponíveis:\n" +
        "• /start - Ativar alertas\n" +
        "• /stop - Desativar alertas\n" +
        "• /status - Ver status\n" +
        "• /help - Mostrar ajuda";
    }

    if (resposta) {
      await whatsappClient.sendText(userId, resposta);
      console.log(`📤 Resposta enviada para ${userId.substring(0, 15)}...`);
    }
  } catch (error) {
    console.error("❌ Erro ao processar mensagem:", error.message);
  }
}

async function enviarSurebets(surebets) {
  try {
    if (!surebets || surebets.length === 0) return;

    const surebetsInteressantes = surebets.filter((surebet) => {
      return (
        !surebet.bloqueado &&
        surebet.odd &&
        parseFloat(surebet.odd) > 1.01 &&
        surebet.nome &&
        surebet.nome.length <= 100 &&
        surebet.nome.includes("(x)")
      );
    });

    if (surebetsInteressantes.length === 0) {
      console.log(
        `🔍 ${surebets.length} surebet(s) detectada(s), mas nenhuma interessante (filtradas)`
      );
      return;
    }

    console.log(
      `🎯 ${surebetsInteressantes.length} SUREBET(S) INTERESSANTE(S) de ${surebets.length} total - verificando mudanças...`
    );

    const usuarios = carregarUsuarios();

    if (usuarios.length === 0) {
      console.log("📋 Nenhum usuário ativo para notificar");
      return;
    }

    for (const surebet of surebetsInteressantes) {
      const identificador = criarIdentificadorSurebet(surebet);
      const oddAtual = parseFloat(surebet.odd);
      const agora = Date.now();

      // Verificar se é uma SUREBET nova ou se a odd mudou
      let isNova = false;
      let oddMudou = false;
      let oddAnterior = null;

      if (historicoSurebets.has(identificador)) {
        const dadosAnteriores = historicoSurebets.get(identificador);
        oddAnterior = dadosAnteriores.odd;

        if (Math.abs(oddAtual - oddAnterior) > 0.01) {
          // Mudança significativa na odd
          oddMudou = true;
          console.log(
            `📈 ODD MUDOU: ${surebet.nome} - ${oddAnterior} → ${oddAtual}`
          );
        }
      } else {
        isNova = true;
        console.log(`🆕 NOVA SUREBET: ${surebet.nome} - Odd: ${oddAtual}`);
      }

      // Atualizar histórico
      historicoSurebets.set(identificador, {
        odd: oddAtual,
        timestamp: agora,
      });

      // Enviar apenas se for nova ou se a odd mudou
      if (isNova || oddMudou) {
        let tipoMensagem = isNova ? "NOVA" : "ATUALIZADA";
        let emojiTipo = isNova ? "🆕" : "📈";

        const mensagem =
          `${emojiTipo} SUREBET ${tipoMensagem}!\n` +
          `📅 ${new Date().toLocaleDateString(
            "pt-BR"
          )} às ${new Date().toLocaleTimeString("pt-BR")}\n` +
          `⚽ Jogo: ${surebet.nome}\n` +
          `🏷️ Mercado: ${surebet.mercado} - ${surebet.optionName}\n` +
          `💸 Odd: ${surebet.odd}${
            oddMudou ? ` (antes: ${oddAnterior})` : ""
          }\n` +
          `🌐 Fonte: BetEsporte.com\n` +
          `⏱️ Próxima verificação em 30s\n` +
          `💡 Use /stop para desativar alertas`;

        const hash = gerarHashSurebet(surebet);

        for (const usuario of usuarios) {
          if (!mensagensEnviadasPorUsuario[usuario]) {
            mensagensEnviadasPorUsuario[usuario] = new Set();
          }

          if (oddMudou) {
            const hashesParaRemover = Array.from(
              mensagensEnviadasPorUsuario[usuario]
            ).filter((h) => h.startsWith(`${surebet.nome}|`));
            hashesParaRemover.forEach((h) =>
              mensagensEnviadasPorUsuario[usuario].delete(h)
            );
          }

          if (mensagensEnviadasPorUsuario[usuario].has(hash)) {
            console.log(
              `⚠️ Mensagem duplicada detectada para: ${surebet.nome} (usuário: ${usuario})`
            );
            continue;
          }

          mensagensEnviadasPorUsuario[usuario].add(hash);

          try {
            if (whatsappClient) {
              await whatsappClient.sendText(usuario, mensagem);
              console.log(
                `📤 SUREBET ${tipoMensagem} enviada para ${usuario.substring(
                  0,
                  15
                )}... ✅`
              );
            } else {
              console.log(`📤 SIMULADO para ${usuario.substring(0, 15)}... ✅`);
              console.log(`   📝 ${mensagem.split("\n")[0]}`);
            }
            await new Promise((resolve) => setTimeout(resolve, 500));
          } catch (error) {
            console.error(
              `❌ Erro ao enviar para ${usuario.substring(0, 15)}...:`,
              error.message
            );
          }
        }
      } else {
        console.log(
          `✅ SUREBET já conhecida sem mudança: ${surebet.nome} - Odd: ${oddAtual}`
        );
      }
    }

    const umHoraAtras = agora - 60 * 60 * 1000;
    for (const [key, value] of historicoSurebets.entries()) {
      if (value.timestamp < umHoraAtras) {
        historicoSurebets.delete(key);
      }
    }
  } catch (error) {
    console.error("❌ Erro ao enviar SUREBETs:", error.message);
  }
}

async function monitorarSurebetsAPI() {
  if (monitorandoAtivo) {
    console.log("⚠️ Monitoramento já está ativo");
    return;
  }
  monitorandoAtivo = true;
  console.log("🚀 Iniciando monitoramento automático de SUREBETs via API...");
  intervalId = setInterval(async () => {
    try {
      const agora = new Date().toLocaleTimeString("pt-BR");
      console.log(`\n🔍 [${agora}] Verificando SUREBETs via API...`);
      const eventos = await buscarSurebetsBetEsporte();
      const surebets = eventos.filter(
        (e) =>
          !e.bloqueado &&
          e.odd &&
          parseFloat(e.odd) > 1.01 &&
          e.nome &&
          e.nome.length <= 100
      );
      if (surebets.length > 0) {
        console.log(
          `🎯 [${agora}] ${surebets.length} SUREBET(S) encontrada(s) via API!`
        );
        await enviarSurebets(surebets);
      } else {
        console.log(`📋 [${agora}] Nenhuma SUREBET encontrada via API`);
      }
    } catch (error) {
      console.error(
        `❌ [${new Date().toLocaleTimeString(
          "pt-BR"
        )}] Erro na verificação via API:`,
        error.message
      );
    }
  }, 30000);
}

async function iniciarSistema() {
  try {
    console.log("\n🚀 INICIANDO SISTEMA FUNCIONAL...");

    console.log("📱 Inicializando WhatsApp...");
    try {
      const whatsappService = new WhatsAppService();
      whatsappClient = await whatsappService.inicializar((client) => {
        whatsappClient = client;
        console.log("✅ WhatsApp conectado!");

        console.log("🔧 Configurando handler de mensagens...");
        client.onMessage(handleMessage);
        console.log("✅ Handler de mensagens ativo!");
      });
    } catch (error) {
      console.log("⚠️ WhatsApp não conectado, usando modo simulação");
      whatsappClient = null;
    }

    console.log("🔍 Iniciando monitoramento de SUREBETs via API...");
    monitorarSurebetsAPI();

    console.log(
      "✅ Sistema operacional - Monitoramento e comandos funcionando em PARALELO!"
    );
  } catch (error) {
    console.error("❌ Erro ao iniciar sistema:", error.message);
  }
}

process.on("SIGINT", async () => {
  console.log("\n🛑 Encerrando sistema...");
  if (intervalId) {
    clearInterval(intervalId);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Encerrando sistema...");
  if (intervalId) {
    clearInterval(intervalId);
  }
  process.exit(0);
});

iniciarSistema();
