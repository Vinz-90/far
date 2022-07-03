import contracts from './contracts'
import { FarmConfig, QuoteToken } from './types'

const farms: FarmConfig[] = [
  {
    pid: 0,
    risk: 3,
    isTokenOnly: true,
    lpSymbol: 'WENLAMBO',
    lpAddresses: {
      97: '0x26759dcb4edb05bea35ae5cde02d33952d949405',
      56: '0x26759dcb4edb05bea35ae5cde02d33952d949405',
    },
    tokenSymbol: 'WENLAMBO',
    tokenAddresses: {
      97: '0x8C9dDbc86a5cA4D3065010aB0c2CbAecaa70C6aB',
      56: '0x8C9dDbc86a5cA4D3065010aB0c2CbAecaa70C6aB',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 1,
    risk: 5,
    lpSymbol: 'WENLAMBO-BNB LP',
    lpAddresses: {
      97: '0xf0b7064082fddea4bc6505bccd3a2b1edeaeb0b0',
      56: '0xf0b7064082fddea4bc6505bccd3a2b1edeaeb0b0',
    },
    tokenSymbol: 'WENLAMBO',
    tokenAddresses: {
      97: '0x8C9dDbc86a5cA4D3065010aB0c2CbAecaa70C6aB',
      56: '0x8C9dDbc86a5cA4D3065010aB0c2CbAecaa70C6aB',
    },
    quoteTokenSymbol: QuoteToken.BNB,
    quoteTokenAdresses: contracts.wbnb,
  },
  {
    pid: 2,
    risk: 3,
    lpSymbol: 'BNB-BUSD LP',
    lpAddresses: {
      97: '0xe0e92035077c39594793e61802a350347c320cf2',
      56: '0x1b96b92314c44b159149f7e0303511fb2fc4774f',
    },
    tokenSymbol: 'BNB',
    tokenAddresses: {
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
  {
    pid: 3,
    risk: 5,
    lpSymbol: 'WENLAMBO-BUSD LP',
    lpAddresses: {
      97: '0x26759dcb4edb05bea35ae5cde02d33952d949405',
      56: '0x26759dcb4edb05bea35ae5cde02d33952d949405',
    },
    tokenSymbol: 'WENLAMBO',
    tokenAddresses: {
      97: '0x8C9dDbc86a5cA4D3065010aB0c2CbAecaa70C6aB',
      56: '0x8C9dDbc86a5cA4D3065010aB0c2CbAecaa70C6aB',
    },
    quoteTokenSymbol: QuoteToken.BUSD,
    quoteTokenAdresses: contracts.busd,
  },
]

export default farms
