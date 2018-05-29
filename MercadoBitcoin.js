const unirest = require('unirest')
const chalk = require('chalk') 
const ENDPOINT_API = 'https://www.mercadobitcoin.com.br/api/'

class MercadoBitcoin {
  constructor (config) {
    this.currency = config.currency 
  }
  ticker (success) {
    this.call('ticker', success)
  }
  orderBook (success) {
    this.call('orderbook', success)
  }
  trades (success) {
    this.call('trades', success)
  }
  call (method, success) {
    unirest.get(ENDPOINT_API + this.currency + '/' + method)
      .headers('Accept', 'application/json')
      .end(response => {
        try {
          success(JSON.parse(response.raw_body))
        } catch(e) {
          console.log(chalk.red(e))
        }
      })
  }
}

module.exports = MercadoBitcoin
