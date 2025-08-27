module.exports = {
  surebet: {
    url: "https://betesporte.bet.br/sports/desktop/sport-league/999/4200000001",
    intervalCheck: 30000,
    pageLoadTimeout: 15000,
    initialWait: 5000,
    elementWait: 2000,
    indicators: ["(x)"],
    filtros: {
      tamanhoMinimo: 25,
      requererMercado: true,
      mercadosValidos: [
        "para ter menos de",
        "para ter mais de",
        "menos de",
        "mais de",
        "Under",
        "Over",
        "gols",
        "corners",
        "escanteios",
        "cartões",
        "para marcar",
        "resultado final",
        "empate anula",
        "handicap",
        "dupla chance",
      ],
    },
    selectors: [
      ".countryCard.ng-star-inserted",
      ".countryCard",
      '[class*="card"]',
      '[class*="event"]',
      '[class*="match"]',
      '[class*="game"]',
      '[class*="bet"]',
      ".event-card",
      ".match-card",
      ".sport-event",
    ],
  },

  chrome: {
    options: [
      "--headless",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-notifications",
      "--disable-images",
      "--disable-javascript",
      "--disable-plugins",
      "--disable-background-timer-throttling",
      "--disable-backgrounding-occluded-windows",
      "--disable-renderer-backgrounding",
      "--window-size=1920,1080",
    ],
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },

  whatsapp: {
    sessionId: "surebet_session",
    maxReconnectAttempts: 3,
    messageDelay: 500,
    authTimeout: 120,
  },

  server: {
    port: 3000,
    host: "localhost",
  },

  files: {
    activeUsers: "./data/usuarios_ativos.json",
  },
};
