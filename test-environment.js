const { execSync } = require("child_process");
const fs = require("fs");

console.log("🔍 TESTE DE AMBIENTE - WHATSAPP BOT");
console.log("===================================");

// Detectar sistema operacional
const isLinux = process.platform === "linux";
const isWindows = process.platform === "win32";
const isVPS = isLinux && !process.env.DISPLAY;

console.log(`📱 Sistema: ${process.platform}`);
console.log(`🖥️  Ambiente: ${isVPS ? "VPS/Servidor" : "Local"}`);
console.log(`📦 Node.js: ${process.version}`);

// Testar Chrome
console.log("\n🌐 TESTANDO CHROME:");
try {
  let chromeVersion;
  if (isLinux) {
    try {
      chromeVersion = execSync("google-chrome --version", {
        encoding: "utf8",
      }).trim();
      console.log(`✅ Chrome encontrado: ${chromeVersion}`);
    } catch (error) {
      console.log(
        "❌ Chrome não encontrado. Execute: sudo apt install -y google-chrome-stable"
      );
    }

    // Testar caminho do Chrome
    if (fs.existsSync("/usr/bin/google-chrome-stable")) {
      console.log("✅ Caminho do Chrome: /usr/bin/google-chrome-stable");
    } else {
      console.log("❌ Chrome não encontrado em /usr/bin/google-chrome-stable");
    }
  } else if (isWindows) {
    console.log("✅ Windows detectado - Chrome será detectado automaticamente");
  }
} catch (error) {
  console.log("❌ Erro ao verificar Chrome:", error.message);
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
