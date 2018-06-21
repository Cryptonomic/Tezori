import React from 'react'
import styled from 'styled-components'
import tezosLogo from '../../../resources/tezosLogo.svg'
import { ms } from '../../styles/helpers'

type Props = {
  size: any,
  color: string,
  weight: string,
  amount: number
}

const Amount = styled.span`
  font-size: ${ ({ size }) => size }
  font-weight: ${ ({ weight = 'normal', theme: { typo: { weights } } }) => weights[weight] }
  color: ${ ({ color, theme: { colors } }) => colors[color] }
`

const TezosAmount = (props:Props) => {
  return (
    <Amount key={'amount'}>
      {props.amount}
      <img scr={props.tezosLogo} alt={'tzo'} />
    </Amount>
  )
}

export default TezosAmount


