import React from 'react'
import styled from 'styled-components'
import { ms } from '../../styles/helpers'
import { logo } from '../../config.json'
const tezosLogo = require(`../../../resources/${logo}`)

const TezosLogo = styled.img`
  width: ${ms(7)};
  height: ${ms(7)};
`

const Logo = () => {
  return (
    <TezosLogo src={tezosLogo} />
  )
}

export default Logo
