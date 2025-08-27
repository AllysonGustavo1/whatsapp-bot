const axios = require('axios');

async function buscarSurebetsBetEsporte() {
  const url = 'https://betesporte.bet.br/api/PreMatch/GetEvents?sportId=999&tournamentId=4200000001';
  const headers = {
    'accept': 'application/json, text/plain, */*',
    'accept-language': 'pt-BR,pt;q=0.9',
    'x-device-id': '7d5551f336f22b2629241310c1a1d65f',
    'x-timezone': '180',
  };

  const response = await axios.get(url, { headers });
  const eventos = [];
  const data = response.data?.data;
  if (!data || !data.countries) return eventos;

  for (const country of data.countries) {
    for (const tournament of country.tournaments) {
      for (const event of tournament.events) {
        for (const market of event.markets) {
          for (const option of market.options) {
            eventos.push({
              id: event.id,
              nome: event.homeTeamName,
              data: event.date,
              odd: option.odd,
              mercado: market.name,
              optionName: option.name,
              bloqueado: option.locked || option.blocked || false
            });
          }
        }
      }
    }
  }
  return eventos;
}

module.exports = { buscarSurebetsBetEsporte };
