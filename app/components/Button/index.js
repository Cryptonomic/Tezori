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

const chooseTheme = buttonTheme => {
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

const WrappedButton = styled.button`
  padding: ${ms(0)} ${ms(6)};
  border: 0;
  border-radius: ${ms(3)};
  font-family: ${({theme}) => theme.typo.fontFamily.primary};
  font-size: ${ms(0)};
  font-weight: 300;
  display: inline-block;
  cursor: pointer;
  ${({buttonTheme}) => chooseTheme(buttonTheme)};
`

function Button({ className, children, disabled, theme, onClick }) {
  return (
    <WrappedButton
      onClick={onClick}
      buttonTheme={theme}
      disabled={disabled}
      className={className}
    >
      {children}
    </WrappedButton>
  )
}

export default Button;
