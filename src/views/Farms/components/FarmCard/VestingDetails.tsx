import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Flex, Heading } from '@pancakeswap-libs/uikit'
import { getBalanceNumber } from 'utils/formatBalance'
import styled from 'styled-components'

interface FarmCardActionsProps {
  lockedEarnings?: BigNumber
  pid?: number
}

const BalanceAndCompound = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
`

const VestingDetails: React.FC<FarmCardActionsProps> = ({ lockedEarnings, pid }) => {
  const rawEarningsBalance = getBalanceNumber(lockedEarnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <Flex mb="8px" justifyContent="space-between" alignItems="center">
      <Heading color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}>{displayBalance}</Heading>
    </Flex>
  )
}

export default VestingDetails
