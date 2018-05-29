require("dotenv-safe").load()
const chalk = require('chalk')
const MercadoBitcoin = require('./MercadoBitcoin')
const MercadoBitcoinTrade = require('./MercadoBitcoinTrade')
const infoApi = new MercadoBitcoin({ currency: 'BTC' })
const tradeApi = new MercadoBitcoinTrade({
  currency: 'BTC',
  key: process.env.KEY,
  secret: process.env.SECRET,
  pin: process.env.PIN
})

setInterval(() => 
  infoApi.ticker(response => {
    const priceToBuy = 25000
    if (response.ticker.sell <= priceToBuy) {
      getQuantity('BRL', response.ticker.sell, true, (qty) => {
        tradeApi.placeBuyOrder(qty, response.ticker.sell, 
          (data) => {
            console.log(chalk.green(`Buy order: ${data}`))
            //operando em STOP
            tradeApi.placeSellOrder(data.quantity, response.ticker.sell * parseFloat(process.env.PROFITABILITY), 
              (data) => console.log(chalk.green(`Sell order: ${data}`)),
              (data) => console.log(chalk.red(`Error sell order: ${data}`)))
          },
          (data) => console.log(chalk.red(`Error buy order: ${data}`)))
      })
    } else {
      console.log(chalk.yellow(`${response.ticker.sell} is greater than ${priceToBuy}... trying again in ${process.env.CRAWLER_INTERVAL/1000} seconds`))
    }
  }),
  process.env.CRAWLER_INTERVAL
)

function getQuantity(coin, price, isBuy, callback) {
  price = parseFloat(price)
  coin = isBuy ? 'brl' : coin.toLowerCase()

  tradeApi.getAccountInfo(response_data => {
    let balance = parseFloat(response_data.balance[coin].available).toFixed(5)
    balance = parseFloat(balance)
    if (isBuy && balance < 50) { 
      return console.log('Sem saldo disponível para comprar!')
    }
    console.log(`Saldo disponível de ${coin}: ${balance}`)

    if (isBuy) {
      balance = parseFloat((balance / price).toFixed(5))
    }
    callback(parseFloat(balance) - 0.00001) //tira a diferença que se ganha no arredondamento
  }, 
  (data) => console.log(data))
}
