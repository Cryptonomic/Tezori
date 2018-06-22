import React from 'react'
import styled from 'styled-components'
import TezosIcon from '../TezosIcon'
import { ms } from '../../styles/helpers'

type Props = {
  amount: number,
  color: string,
  iconName: string,
  size: any,
  weight: string,
}

const Amount = styled.span`
  color: ${ ({ color, theme: { colors } }) => colors[color] }
  font-size: ${ ({ size }) => size }
  font-weight: ${ ({ weight = 'normal', theme: { typo: { weights } } }) => weights[weight] }
`

const TezosAmount = (props:Props) => {
  const { size, color, amount, iconName } = props
  return (
    <Amount>
      {amount}
      <TezosIcon size={size} color={color} iconName={iconName}/>
    </Amount>
  )
}

TezosAmount.defaultProps = {
  amount: 0,
  color: 'primary',
  iconName: 'tezos',
  size: ms(0),
  weight: 'normal',
}

export default TezosAmount
