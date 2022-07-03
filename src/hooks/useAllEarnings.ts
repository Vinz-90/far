import { AbiItem } from 'web3-utils'
import { useEffect, useState } from 'react'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import multicall from 'utils/multicall'
import { getMasterChefAddress, getMasterChefCompoundAddress } from 'utils/addressHelpers'
import masterChefABI from 'config/abi/masterchef.json'
import { farmsConfig } from 'config/constants'
import { getWeb3 } from 'utils/web3'
import { rewardTokenPool } from 'utils/getFarmConfig'
import masterchefCompoundABI from 'config/abi/masterchefCompound.json'
import useRefresh from './useRefresh'

const web3 = getWeb3()
const masterCompoundChefContract = new web3.eth.Contract((masterchefCompoundABI as unknown) as AbiItem, getMasterChefCompoundAddress())

const useAllEarnings = () => {
  const [balances, setBalance] = useState([])
  const { account }: { account: string } = useWallet()
  const { fastRefresh } = useRefresh()

  useEffect(() => {
    const fetchAllBalances = async () => {
      const calls = farmsConfig.map((farm) => ({
        address: getMasterChefAddress(),
        name: 'pendingTokens',
        params: [farm.pid, account],
      }))

      const res = await multicall(masterChefABI, calls)
      const parsedUnlockedEarning = (await masterCompoundChefContract.methods.viewUnclaimed(account).call()).unlocked_

      setBalance([...res, parsedUnlockedEarning])
    }

    if (account) {
      fetchAllBalances()
    }
  }, [account, fastRefresh])

  return balances
}

export default useAllEarnings
