import React from 'react'
import styled from 'styled-components'
import transactionsEmptyState.svg from '../../../resources'

const Image = styled.img`
  color: ${ ({ color, theme: { colors } }) => colors[color] }
`

const Title = styled.p`
  color: 
`

const EmptyState = () => {
  return (
    <Image alt={'transactions empty state'} src={transactionsEmptyState} />

  )
}