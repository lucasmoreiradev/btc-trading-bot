require("dotenv-safe").load()
const MercadoBitcoin = require('./MercadoBitcoin')
const infoApi = new MercadoBitcoin({ currency: 'BTC' })

setInterval(() => 
  infoApi.ticker(tick => console.log(tick.ticker)),
  process.env.CRAWLER_INTERVAL
)
