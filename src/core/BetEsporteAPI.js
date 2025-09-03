const axios = require("axios");

async function buscarSurebetsBetEsporte() {
  const url =
    "https://betesporte.bet.br/api/PreMatch/GetEvents?sportId=999&tournamentId=4200000001";
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "pt-BR,pt;q=0.9",
    "x-device-id": "7d5551f336f22b2629241310c1a1d65f",
    "x-timezone": "180",
  };

  const response = await axios.get(url, { headers });
  const eventos = [];
  const data = response.data?.data;
  if (!data || !data.countries) return eventos;

  for (const country of data.countries) {
    for (const tournament of country.tournaments) {
      for (const event of tournament.events) {
        // Filtrar eventos que contenham "trave" no nome
        const nomeCompleto =
          `${event.homeTeamName} vs ${event.awayTeamName}`.toLowerCase();
        if (nomeCompleto.includes("trave")) {
          continue; // Pular este evento
        }

        for (const market of event.markets) {
          // Filtrar mercados que contenham "trave"
          if (market.name && market.name.toLowerCase().includes("trave")) {
            continue; // Pular este mercado
          }

          for (const option of market.options) {
            // Filtrar opções que contenham "trave"
            if (option.name && option.name.toLowerCase().includes("trave")) {
              continue; // Pular esta opção
            }

            eventos.push({
              id: event.id,
              nome: event.homeTeamName,
              data: event.date,
              odd: option.odd,
              mercado: market.name,
              optionName: option.name,
              bloqueado: option.locked || option.blocked || false,
            });
          }
        }
      }
    }
  }
  return eventos;
}

async function preverSurebets() {
  try {
    // Determinar as datas para buscar jogos
    const agora = new Date();
    const horaAtual = agora.getHours();
    const duasHorasAFrente = new Date(agora.getTime() + 2 * 60 * 60 * 1000);

    let dataInicio, dataFim;

    // Se for até 22 horas, pegar jogos do dia atual
    // Se passar de 22 horas, pegar do próximo dia (pois 2 horas para frente será próximo dia)
    if (horaAtual <= 22) {
      dataInicio = new Date();
      dataInicio.setHours(3, 0, 0, 0); // 03:00:00.000Z

      dataFim = new Date(dataInicio);
      dataFim.setDate(dataFim.getDate() + 1);
      dataFim.setHours(2, 59, 59, 999); // 02:59:59.999Z do próximo dia
    } else {
      // Pegar jogos do próximo dia
      dataInicio = new Date();
      dataInicio.setDate(dataInicio.getDate() + 1);
      dataInicio.setHours(3, 0, 0, 0);

      dataFim = new Date(dataInicio);
      dataFim.setDate(dataFim.getDate() + 1);
      dataFim.setHours(2, 59, 59, 999);
    }

    // Primeira requisição - buscar lista de jogos
    const jogosPotenciais = await buscarJogosDodia(
      dataInicio,
      dataFim,
      duasHorasAFrente
    );

    // Segunda requisição - verificar detalhes de cada jogo para encontrar surebets
    const surebetsPrevistas = [];

    for (const jogo of jogosPotenciais) {
      const detalhesJogo = await buscarDetalhesJogo(
        jogo.id,
        jogo.sportId,
        jogo.tournamentId,
        jogo.countryId
      );

      if (detalhesJogo && temSurebetPrevista(detalhesJogo)) {
        const mercadosLocked = getMercadosLocked(detalhesJogo);
        surebetsPrevistas.push({
          id: jogo.id,
          homeTeam: jogo.homeTeamName,
          awayTeam: jogo.awayTeamName,
          data: jogo.date,
          tournament: jogo.tournament,
          country: jogo.country,
          mercadosLocked: mercadosLocked,
        });

        // Mostrar apenas quando encontrar surebet
        const horarioDeteccao = new Date().toLocaleString("pt-BR");
        console.log(`🔮VISÃO PROFÉTICA DETECTADA!🔮 [${horarioDeteccao}]`);
        console.log(
          "╔═══════════════════════════════════════════════════════════╗"
        );
        const dataJogo = new Date(jogo.date).toLocaleString("pt-BR");
        console.log(
          `║ ${surebetsPrevistas.length.toString().padStart(2, "0")}. ⚽ ${
            jogo.homeTeamName
          } vs ${jogo.awayTeamName}`
        );
        console.log(`║     🏟️  ${jogo.tournament} (${jogo.country})`);
        console.log(`║     � ${dataJogo}`);
        console.log(
          "╚═══════════════════════════════════════════════════════════╝"
        );
      }

      // Aguardar 10 segundos entre requisições
      await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    return surebetsPrevistas;
  } catch (error) {
    console.error("Erro ao prever surebets:", error);
    return [];
  }
}

async function buscarJogosDodia(dataInicio, dataFim, limiteTempo) {
  const url = `https://betesporte.bet.br/api/PreMatch/GetEventsByDate?sportId=1&startDate=${dataInicio.toISOString()}&endDate=${dataFim.toISOString()}&searchNextDays=false`;

  const headers = {
    accept: "application/json, text/plain, */*",
    "sec-ch-ua":
      '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "x-device-id": "aaeba9de80c8ad33b429fb1c7b21451c",
    "x-timezone": "180",
  };

  const response = await axios.get(url, { headers });
  const jogos = [];

  const data = response.data?.data;
  if (!data || !data.countries) return jogos;

  for (const country of data.countries) {
    for (const tournament of country.tournaments) {
      for (const event of tournament.events) {
        const dataJogo = new Date(event.date);

        // Filtrar jogos que contenham "trave" no nome
        const nomeCompleto =
          `${event.homeTeamName} vs ${event.awayTeamName}`.toLowerCase();
        if (nomeCompleto.includes("trave")) {
          continue; // Pular este jogo
        }

        if (dataJogo <= limiteTempo) {
          jogos.push({
            id: event.id,
            homeTeamName: event.homeTeamName,
            awayTeamName: event.awayTeamName,
            date: event.date,
            sportId: 1,
            tournamentId: tournament.id,
            countryId: country.id,
            tournament: tournament.name,
            country: country.name,
          });
        }
      }
    }
  }

  return jogos;
}

async function buscarDetalhesJogo(eventId, sportId, tournamentId, countryId) {
  const url = `https://betesporte.bet.br/api/PreMatch/GetEventDetail?eventId=${eventId}&sportId=${sportId}&tournamentId=${tournamentId}&countryId=${countryId}`;

  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
    priority: "u=1, i",
    "sec-ch-ua":
      '"Not;A=Brand";v="99", "Google Chrome";v="139", "Chromium";v="139"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-device-id": "aaeba9de80c8ad33b429fb1c7b21451c",
    "x-timezone": "180",
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data?.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes do jogo ${eventId}:`, error.message);
    return null;
  }
}

function temSurebetPrevista(detalhesJogo) {
  if (!detalhesJogo || !detalhesJogo.countries) return false;

  for (const country of detalhesJogo.countries) {
    for (const tournament of country.tournaments) {
      for (const event of tournament.events) {
        for (const market of event.markets) {
          // Verificar se é mercado "Total" e se tem opções "Mais de 1.5", "Mais de 2.5" ou "Mais de 3.5" locked
          if (market.name === "Total") {
            for (const option of market.options) {
              if (
                (option.name === "Mais de 1.5" ||
                  option.name === "Mais de 2.5" ||
                  option.name === "Mais de 3.5") &&
                option.locked === true
              ) {
                return true;
              }
            }
          }
        }
      }
    }
  }

  return false;
}

function getMercadosLocked(detalhesJogo) {
  const mercadosLocked = [];

  if (!detalhesJogo || !detalhesJogo.countries) return mercadosLocked;

  for (const country of detalhesJogo.countries) {
    for (const tournament of country.tournaments) {
      for (const event of tournament.events) {
        for (const market of event.markets) {
          if (market.name === "Total") {
            for (const option of market.options) {
              if (
                (option.name === "Mais de 1.5" ||
                  option.name === "Mais de 2.5" ||
                  option.name === "Mais de 3.5") &&
                option.locked === true
              ) {
                mercadosLocked.push({
                  mercado: market.name,
                  opcao: option.name,
                  odd: option.odd,
                  line: market.line,
                });
              }
            }
          }
        }
      }
    }
  }

  return mercadosLocked;
}

module.exports = {
  buscarSurebetsBetEsporte,
  preverSurebets,
  buscarJogosDodia,
  buscarDetalhesJogo,
  temSurebetPrevista,
  getMercadosLocked,
};
