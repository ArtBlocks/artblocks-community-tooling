import { BigNumber, ethers } from 'ethers'

export const ETH_ADDR = '0x0000000000000000000000000000000000000000'
export const WETH_ADDR = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const USDC_ADDR = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
export const DAI_ADDR = '0x6b175474e89094c44da98b954eedeac495271d0f'
export const ABST_ADDR = '0x2feb105fbb4c922597b125c56822b3db7351b55d'

const KNOWN_TOKENS = {
  [ETH_ADDR]: 'ETH',
  [WETH_ADDR]: 'WETH',
  [USDC_ADDR]: 'USDC',
  [DAI_ADDR]: 'DAI',
  [ABST_ADDR]: 'ABST',
}

export function addressToPaymentToken(address: string): string {
  return KNOWN_TOKENS[address] || 'UNKNOW PAYMENT TOKEN'
}

export function amountHumanReadable(crypto: string, amount: BigNumber): string {
  switch (crypto) {
    case 'ETH':
      return parseFloat(ethers.utils.formatEther(amount)).toString()

    case 'WETH':
      return parseFloat(ethers.utils.formatEther(amount)).toString()

    case 'USDC':
      return amount.div(1_000_000).toNumber().toString()

    case 'DAI':
      return parseFloat(ethers.utils.formatEther(amount)).toString()

    case 'ABST':
      return amount.div(10_000).toNumber().toString()

    default:
      return amount.toString()
  }
}
