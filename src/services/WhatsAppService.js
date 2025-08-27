const wa = require("@open-wa/wa-automate");
const config = require("../../config/config");

class WhatsAppService {
  constructor() {
    this.client = null;
    this.tentativasReconexao = 0;
    this.maxTentativas = config.whatsapp.maxReconnectAttempts;
  }

  async inicializar(callbackStart) {
    try {
      console.log("🔄 Conectando ao WhatsApp...");

      const isVPS = process.platform === "linux" && !process.env.DISPLAY;
      const chromeOptions = isVPS
        ? this.getVPSChromeConfig()
        : this.getLocalChromeConfig();

      const client = await wa.create({
        sessionId: config.whatsapp.sessionId,
        multiDevice: true,
        authTimeout: config.whatsapp.authTimeout,
        blockCrashLogs: true,
        disableSpins: true,
        headless: true,
        hostNotificationLang: "PT_BR",
        logConsole: false,
        popup: true,
        qrTimeout: 0,
        useChrome: true,
        browserRevision: null,
        executablePath: chromeOptions.executablePath,
        killProcessOnBrowserClose: true,
        throwErrorOnTosBlock: false,
        bypassCSP: true,
        restartOnCrash: callbackStart,
        browserArgs: chromeOptions.args,
      });

      console.log("✅ WhatsApp conectado com sucesso!");
      this.client = client;
      callbackStart(client);
      return client;
    } catch (error) {
      console.error(
        `❌ Erro ao conectar WhatsApp (tentativa ${
          this.tentativasReconexao + 1
        }):`,
        error.message
      );

      this.tentativasReconexao++;

      if (this.tentativasReconexao < this.maxTentativas) {
        console.log(
          `🔄 Tentando novamente em 10 segundos... (${this.tentativasReconexao}/${this.maxTentativas})`
        );

        this.limparSessao();

        setTimeout(() => {
          this.inicializar(callbackStart);
        }, 10000);
      } else {
        console.error("❌ Falha ao conectar após múltiplas tentativas");
        this.mostrarSolucoes();
      }
    }
  }

  getVPSChromeConfig() {
    const fs = require("fs");
    let executablePath = "/usr/bin/google-chrome-stable";

    if (!fs.existsSync("/usr/bin/google-chrome-stable")) {
      if (fs.existsSync("/usr/bin/chromium-browser")) {
        executablePath = "/usr/bin/chromium-browser";
        console.log("🔧 Usando Chromium (ARM64 compatible)");
      } else if (fs.existsSync("/usr/bin/chromium")) {
        executablePath = "/usr/bin/chromium";
        console.log("🔧 Usando Chromium");
      } else {
        console.log("❌ Nenhum browser encontrado");
      }
    } else {
      console.log("🔧 Usando Google Chrome");
    }

    return {
      executablePath: executablePath,
      args: [
        "--headless",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-notifications",
        "--disable-images",
        "--disable-plugins",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=VizDisplayCompositor",
        "--single-process",
        "--no-zygote",
        "--window-size=1920,1080",
        "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      ],
    };
  }

  getLocalChromeConfig() {
    return {
      executablePath: null, // Deixa o sistema encontrar automaticamente
      args: config.chrome.options,
    };
  }

  limparSessao() {
    try {
      const fs = require("fs");
      if (fs.existsSync("_IGNORE_surebet_session")) {
        console.log("🧹 Limpando dados de sessão...");
        fs.rmSync("_IGNORE_surebet_session", { recursive: true, force: true });
      }
    } catch (cleanError) {
      console.log("⚠️ Erro ao limpar sessão:", cleanError.message);
    }
  }

  mostrarSolucoes() {
    console.log("💡 Possíveis soluções:");
    console.log("   🔍 Para detectar arquitetura: uname -m");
    console.log("   📋 ARM64 (aarch64):");
    console.log("      sudo apt install -y chromium-browser");
    console.log(
      "      sudo ln -sf /usr/bin/chromium-browser /usr/bin/google-chrome-stable"
    );
    console.log("   📋 x86_64 (Intel/AMD):");
    console.log("      sudo apt install -y google-chrome-stable");
    console.log("   2. Verifique se o browser está instalado:");
    console.log(
      "      google-chrome-stable --version || chromium-browser --version"
    );
    console.log(
      "   3. Execute o script de instalação: bash scripts/install-vps.sh"
    );
    console.log("   4. Reinicie o servidor se necessário");
  }

  async enviarMensagem(numero, mensagem) {
    if (!this.client) {
      throw new Error("WhatsApp não está conectado");
    }

    try {
      await this.client.sendText(numero, mensagem);
      return true;
    } catch (error) {
      console.error(
        `❌ Erro ao enviar mensagem para ${numero.substring(0, 15)}...`,
        error.message
      );
      return false;
    }
  }

  async enviarParaUsuarios(usuarios, mensagem) {
    if (!this.client || usuarios.size === 0) {
      return { sucessos: 0, falhas: 0 };
    }

    let sucessos = 0;
    let falhas = 0;

    for (const numero of usuarios) {
      try {
        const sucesso = await this.enviarMensagem(numero, mensagem);
        if (sucesso) {
          sucessos++;
        } else {
          falhas++;
        }

        await new Promise((resolve) =>
          setTimeout(resolve, config.whatsapp.messageDelay)
        );
      } catch (error) {
        falhas++;
      }
    }

    return { sucessos, falhas };
  }

  estaConectado() {
    return this.client !== null;
  }

  getClient() {
    return this.client;
  }
}

module.exports = { WhatsAppService };
