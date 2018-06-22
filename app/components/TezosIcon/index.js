import React from 'react'
import styled from 'styled-components'
import ms from '../../styles/helpers'

const Icon = styled.span`
  font-family: ${ ({ theme: { typo: { fontFamily } } }) => fontFamily.tezosIcons }
  font-size: ${ ({ size }) => size }
  color: ${ ({ color, theme: { colors } }) => colors[color] }
`

type Props = {
  iconName: string,
  color: string,
  size: any
}

const getIconByName = iconName => {
  switch(iconName) {
    case 'arrow-left':
      return '&#xe900';
    case 'arrow-right':
      return '&#xe902';
    case 'checkmark':
      return '&#xe902';
    case 'checkmark-outline':
      return '&#xe904';
    case 'help':
      return '&#xe905';
    case 'manager':
      return '&#xe906';
    case 'smart-address':
      return '&#xe907';
    case 'tezos':
      return '&#xe908;';
    case 'warning':
      return '&#xe909';
  }
}

const TezosIcon = (props:Prosp) => {
  const { iconName } = props
  return <Icon>{getIconByName(iconName)}</Icon>
}

TezosIcon.defaultProps = {
  size: ms(0),
  color: 'primary',
  iconName: 'tezos'
}

export default TezosIcon
