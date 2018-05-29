const unirest = require('unirest')
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
        success(JSON.parse(response.raw_body))
      })
  }
}

module.exports = MercadoBitcoin
