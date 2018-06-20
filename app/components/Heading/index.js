// @flow

import React from 'react'
import styled, { css } from 'styled-components'

import { ms } from '../../styles/helpers'

const H1 = css`
  font-size: ${ms(5)};
  color: ${({ theme: { colors } }) => colors.white };
`

const H2 = css`
  font-size: ${ms(4)};
`

const H3 = css`
  font-size: ${ms(3)};
`

const H4 = css`
  color: ${({ theme: { colors } }) => colors.white };
  font-size: ${ms(2)};
`
const H5 = css`
  font-size: ${ms(1)};
`

const chooseTheme = (headingTheme: 'h1' | 'h2' | 'h3' | 'h4' | 'h5') => {
  switch(headingTheme) {
    case 'h1':
      return H1;
    case 'h2':
      return H2;
    case 'h3':
      return H3;
    case 'h4':
      return H4
    case 'h5':
      return H5
    case 'h6':
      return H6
    default:
      return H3;
  }
}

const StyledHeading = styled.p`
  color: ${ ({ theme: { colors } }) => colors.primary };
  font-family: ${ ({ theme }) => theme.typo.fontFamily.primary };
  font-size: ${ms(3)};
  font-weight: 300;
  ${({headingTheme}) => chooseTheme(headingTheme)};
`

type Props = {
  className?: string,
  theme?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  type?: string,
  children?: string
};

const Heading = (props: Props) => {
  const { className, children, type, theme } = props
  return (
    <StyledHeading
      type={'string'}
      headingTheme={theme}
      className={className}
    >
      {children}
    </StyledHeading>
  )
}

export default Heading;
