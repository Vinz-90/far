import { farmsConfig } from 'config/constants'
import addresses from 'config/constants/contracts'

const chainId = process.env.REACT_APP_CHAIN_ID

const getFarmConfig = (pid: number) => farmsConfig.find((f) => f.pid === pid)
export const rewardTokenPool = () => farmsConfig.find((f) => f.isTokenOnly && f.tokenAddresses[chainId] === addresses.cake[chainId])

export default getFarmConfig
