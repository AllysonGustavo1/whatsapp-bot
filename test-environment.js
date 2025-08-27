const { execSync } = require("child_process");
const fs = require("fs");

console.log("🔍 TESTE DE AMBIENTE - WHATSAPP BOT");
console.log("===================================");

// Detectar sistema operacional e arquitetura
const isLinux = process.platform === "linux";
const isWindows = process.platform === "win32";
const isVPS = isLinux && !process.env.DISPLAY;
const { execSync } = require("child_process");

let arch = "unknown";
try {
  arch = execSync("uname -m", { encoding: "utf8" }).trim();
} catch (error) {
  arch = process.arch;
}

console.log(`📱 Sistema: ${process.platform}`);
console.log(`💻 Arquitetura: ${arch}`);
console.log(`🖥️  Ambiente: ${isVPS ? "VPS/Servidor" : "Local"}`);
console.log(`📦 Node.js: ${process.version}`);

// Detectar tipo de arquitetura
const isARM64 = arch === "aarch64" || arch === "arm64";
const isX86_64 = arch === "x86_64" || arch === "amd64";

if (isARM64) {
  console.log("🔧 ARM64 detectado - Requer Chromium");
} else if (isX86_64) {
  console.log("🔧 x86_64 detectado - Pode usar Chrome ou Chromium");
}

// Testar Chrome/Chromium
console.log("\n🌐 TESTANDO BROWSER:");
try {
  let browserVersion;
  if (isLinux) {
    // Tentar Google Chrome primeiro
    try {
      browserVersion = execSync("google-chrome-stable --version", {
        encoding: "utf8",
      }).trim();
      console.log(`✅ Chrome encontrado: ${browserVersion}`);
    } catch (error) {
      // Se Chrome não funcionar, tentar Chromium
      try {
        browserVersion = execSync("chromium-browser --version", {
          encoding: "utf8",
        }).trim();
        console.log(`✅ Chromium encontrado: ${browserVersion}`);
      } catch (chromiumError) {
        if (isARM64) {
          console.log(
            "❌ Chromium não encontrado. Execute: sudo apt install -y chromium-browser"
          );
          console.log("💡 ARM64 requer Chromium (Chrome não suporta ARM64)");
        } else {
          console.log(
            "❌ Browser não encontrado. Execute: sudo apt install -y google-chrome-stable"
          );
        }
      }
    }

    // Verificar caminhos dos executáveis
    const possiblePaths = [
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium-browser",
      "/usr/bin/chromium",
    ];

    let foundPath = null;
    for (const path of possiblePaths) {
      if (fs.existsSync(path)) {
        foundPath = path;
        break;
      }
    }

    if (foundPath) {
      console.log(`✅ Executável encontrado: ${foundPath}`);
    } else {
      console.log("❌ Nenhum executável de browser encontrado");
    }
  } else if (isWindows) {
    console.log("✅ Windows detectado - Chrome será detectado automaticamente");
  }
} catch (error) {
  console.log("❌ Erro ao verificar browser:", error.message);
}

// Testar dependências Node.js
console.log("\n📦 TESTANDO DEPENDÊNCIAS:");
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));
const dependencies = Object.keys(packageJson.dependencies || {});

dependencies.forEach((dep) => {
  try {
    require.resolve(dep);
    console.log(`✅ ${dep}`);
  } catch (error) {
    console.log(`❌ ${dep} - Execute: npm install`);
  }
});

// Testar arquivos necessários
console.log("\n📁 TESTANDO ARQUIVOS:");
const requiredFiles = [
  "./config/config.js",
  "./src/services/WhatsAppService.js",
  "./src/core/BetEsporteAPI.js",
  "./data/usuarios_ativos.json",
];

requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Arquivo não encontrado`);
  }
});

// Configurações recomendadas
console.log("\n⚙️  CONFIGURAÇÕES RECOMENDADAS:");
if (isVPS) {
  console.log("📋 Para VPS Ubuntu:");
  console.log("   export CHROME_PATH=/usr/bin/google-chrome-stable");
  console.log("   export DISPLAY=:99");
  console.log("   pm2 start index.js --name whatsapp-bot");
} else {
  console.log("📋 Para ambiente local:");
  console.log("   npm start");
}

console.log("\n🎯 TESTE CONCLUÍDO");
console.log("Se todos os itens estão ✅, seu bot deve funcionar corretamente!");
