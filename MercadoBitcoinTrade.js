const unirest = require('unirest')
const chalk = require('chalk')
const qs = require('querystring')
const crypto = require('crypto')
const ENDPOINT_API = 'https://www.mercadobitcoin.com.br/api/'
const ENDPOINT_TRADE_PATH = '/tapi/v3/'
const ENDPOINT_TRADE_API = 'https://www.mercadobitcoin.net' + ENDPOINT_TRADE_PATH

class MercadoBitcoinTrade {
  constructor (config) {
    this.currency = config.currency 
    this.key = config.key
    this.secret = config.secret
    this.pin = config.pin
  }
  getAccountInfo (success, error) {
    this.call('get_account_info', {}, success, error)
  }
  listMyOrders (parameters, success, error) {
    this.call('list_orders', parameters, success, error)
  }
  placeBuyOrder (qty, limit_price, success, error) {
    this.call('place_buy_order', { coin_pair: `BRL${this.currency}`, 
      quantity: (''+qty).substr(0,10), limit_price: ''+limit_price }, success, error)
  }
  placeSellOrder (qty, limit_price, success, error) {
    this.call('place_sell_order', { coin_pair: `BRL${this.currency}`,
      quantity: (''+qty).substr(0,10), limit_price: ''+limit_price }, success, error)
  }
  cancelOrder (orderId, success, error) {
    this.call('cancel_order', { coin_pair: `BRL${this.currency}`,
      order_id: orderId }, success, error)
  }
  call (method, parameters, success, error) {
   const now = Math.round(new Date().getTime() / 1000)
   let queryString = qs.stringify({ 'tapi_method': method, 'tapi_nonce': now })
    if (parameters) {
      queryString += '&' + qs.stringify(parameters)
    } 
 
   const signature = crypto.createHmac('sha512', this.secret)
                         .update(ENDPOINT_TRADE_PATH + '?' + queryString)
                         .digest('hex')
 
   unirest.post(ENDPOINT_TRADE_API)
          .headers({ 'TAPI-ID': this.key })
          .headers({ 'TAPI-MAC': signature })
          .send(queryString)
          .end(response => {
              if (response.body) {
                if (response.body.status_code === 100 && success) {
                  success(response.body.response_data)
                } else if (error) {
                  error(response.body.error_message)
                } else {
                  console.log(chalk.yellow(response.body))
                }
              } else {
                console.log(chalk.red(response))
              }
          })

  }
}

module.exports = MercadoBitcoinTrade
