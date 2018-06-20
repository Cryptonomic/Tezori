// @flow

import React from 'react'
import styled, {css} from 'styled-components'
import { lighten } from 'polished'

import { ms } from '../../styles/helpers'

const primaryTheme = css`
  background: ${({theme: {colors}}) => colors.accent};
  color: ${({theme: {colors}}) => colors.secondary};
  transition: background ${({theme: {animations}}) => animations.defaultTime};
  
  &:hover {
    background: ${({theme: {colors}}) => lighten(0.08, colors.accent)};
  }
`

const secondaryTheme = css`
  
`

const plainTheme = css`
  
`

const chooseTheme = (buttonTheme: 'primary' | 'secondary' | 'plain') => {
  switch(buttonTheme) {
    case 'primary':
      return primaryTheme;
    case 'secondary':
      return secondaryTheme;
    case 'plain':
      return plainTheme;
    default:
      return primaryTheme;
  }
}

const StyledButton = styled.button`
  padding: ${ms(0)} ${ms(6)};
  border: 0;
  border-radius: ${ms(3)};
  font-family: ${({theme}) => theme.typo.fontFamily.primary};
  font-size: ${ms(0)};
  font-weight: 300;
  display: inline-block;
  cursor: pointer;
  -webkit-app-region: no-drag;
  ${({buttonTheme}) => chooseTheme(buttonTheme)};
`

type Props = {
  className?: string,
  children?: mixed,
  disabled?: boolean,
  theme?: 'primary' | 'secondary' | 'plain',
  type?: string,
  onClick?: Function
};

function Button(props: Props) {
  const { className, children, disabled, theme, type, onClick } = props
  return (
    <StyledButton
      onClick={onClick}
      type={type || 'button'}
      buttonTheme={theme}
      disabled={disabled}
      className={className}
    >
      {children}
    </StyledButton>
  )
}

export default Button;
