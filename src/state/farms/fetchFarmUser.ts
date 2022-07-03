import { AbiItem } from 'web3-utils'
import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import masterchefABI from 'config/abi/masterchef.json'
import masterchefCompoundABI from 'config/abi/masterchefCompound.json'
import multicall from 'utils/multicall'
import farmsConfig from 'config/constants/farms'
import { getMasterChefAddress, getMasterChefCompoundAddress } from 'utils/addressHelpers'
import { getWeb3 } from 'utils/web3'
import { rewardTokenPool } from 'utils/getFarmConfig'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const rewardTokenPid = rewardTokenPool()?.pid
const nonCompoundPools = farmsConfig.filter((f) => f.pid !== rewardTokenPid)

const web3 = getWeb3()
const masterCompoundChefContract = new web3.eth.Contract((masterchefCompoundABI as unknown) as AbiItem, getMasterChefCompoundAddress())

export const fetchFarmUserAllowances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const masterChefAdress = farm.pid === rewardTokenPid ? getMasterChefCompoundAddress() : getMasterChefAddress()
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return { address: lpContractAddress, name: 'allowance', params: [account, masterChefAdress] }
  })

  const rawLpAllowances = await multicall(erc20ABI, calls)
  const userTokenAllowance = farmsConfig.reduce(
    (acc, farm, index) => ({
      ...acc,
      [farm.pid]: new BigNumber(rawLpAllowances[index]).toJSON(),
    }),
    {},
  )

  return { ...userTokenAllowance }
}

export const fetchFarmUserTokenBalances = async (account: string) => {
  const calls = farmsConfig.map((farm) => {
    const lpContractAddress = farm.isTokenOnly ? farm.tokenAddresses[CHAIN_ID] : farm.lpAddresses[CHAIN_ID]
    return {
      address: lpContractAddress,
      name: 'balanceOf',
      params: [account],
    }
  })

  const rawTokenBalances = await multicall(erc20ABI, calls)

  const userTokenBalances = farmsConfig.reduce(
    (acc, farm, index) => ({
      ...acc,
      [farm.pid]: new BigNumber(rawTokenBalances[index]).toJSON(),
    }),
    {},
  )

  return { ...userTokenBalances }
}

export const fetchFarmUserStakedBalances = async (account: string) => {
  const calls = nonCompoundPools.map((farm) => {
    return {
      address: getMasterChefAddress(),
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(masterchefABI, calls)

  const stakedBalances = nonCompoundPools.reduce(
    (acc, farm, index) => ({
      ...acc,
      [farm.pid]: new BigNumber(rawStakedBalances[index][0]._hex).toJSON(),
    }),
    {},
  )
  const { shares: masterPoolAmount } = await masterCompoundChefContract.methods.userInfo('0', account).call()

  return { ...stakedBalances, [rewardTokenPid]: new BigNumber(masterPoolAmount).toJSON() }
}

export const fetchFarmUserEarnings = async (account: string) => {
  const masterChefAdress = getMasterChefAddress()
  
  const res = await Promise.all(nonCompoundPools.map(async (farm) => {
    const calls = [
      {
        address: masterChefAdress,
        name: 'pendingTokens',
        params: [farm.pid, account],
      },
      {
        address: masterChefAdress,
        name: 'lockedTokens',
        params: [account],
      },
    ]

    return multicall(masterchefABI, calls)
  }))

  const parsedEarnings = nonCompoundPools.reduce(
    (acc, farm, index) => {
      const earnings = res[index][0][0]
      const lockedEarnings = res[index][1][0]

      return {
        ...acc,
        [farm.pid]: [new BigNumber(earnings._hex).toJSON(), new BigNumber(lockedEarnings._hex).toJSON()]
      }
    },
    {},
  )
  
  const parsedEarning = await masterCompoundChefContract.methods.unlockedTokens(account).call()
  const parsedUnlockedEarning = await masterCompoundChefContract.methods.lockedTokens(account).call()
  return { ...parsedEarnings, [rewardTokenPid]: [new BigNumber(parsedEarning).toJSON(), new BigNumber(parsedUnlockedEarning).toJSON()] }
}
