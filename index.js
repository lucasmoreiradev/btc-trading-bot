require("dotenv-safe").load()
const MercadoBitcoin = require('./api')
const infoApi = new MercadoBitcoin({ currency: 'BTC' })

setInterval(() => 
  infoApi.ticker(tick => console.log(tick.ticker)),
  process.env.CRAWLER_INTERVAL
)
