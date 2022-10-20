import { BigNumber, ethers } from 'ethers'

export const ETH_ADDR = '0x0000000000000000000000000000000000000000'
export const WETH_ADDR = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
export const USDC_ADDR = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
export const DAI_ADDR = '0x6b175474e89094c44da98b954eedeac495271d0f'
export const ABST_ADDR = '0x2feb105fbb4c922597b125c56822b3db7351b55d'
export const RARI_ADDR = '0xfca59cd816ab1ead66534d82bc21e7515ce441cf'

export const ART_BLOCKS_PAYMENT_TOKENS = ['ETH', 'WETH', 'USDC', 'DAI', 'ABST', 'RARI']

export function addressToPaymentToken(address: string) {
  switch (address) {
    case ETH_ADDR:
      return 'ETH'

    case WETH_ADDR:
      return 'WETH'

    case USDC_ADDR:
      return 'USDC'

    case DAI_ADDR:
      return 'DAI'

    case ABST_ADDR:
      return 'ABST'

    case RARI_ADDR:
      return 'RARI'

    default:
      console.error(`UNKNOWN PAYMENT TOKEN ${address}, ABANDON!`)
      process.exit(-1)
  }
}

export function amountHumanReadable(crypto: string, amount: BigNumber): string {
  switch (crypto) {
    case 'ETH':
      return parseFloat(ethers.utils.formatEther(amount)).toFixed(5)

    case 'WETH':
      return parseFloat(ethers.utils.formatEther(amount)).toFixed(5)

    case 'USDC':
      return amount.div(1_000_000).toNumber().toFixed(2)

    case 'DAI':
      return parseFloat(ethers.utils.formatEther(amount)).toFixed(2)

    case 'ABST':
      return amount.div(10_000).toNumber().toFixed(3)

    case 'RARI':
      return parseFloat(ethers.utils.formatEther(amount)).toFixed(5)

    default:
      console.error(`UNKNOWN CRYPTO ${crypto}, ABANDON!`)
      process.exit(-1)
  }
}
