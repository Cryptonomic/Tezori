// @flow

import React from 'react'
import styled, { css } from 'styled-components'
import { lighten, darken } from 'polished'

import { ms } from '../../styles/helpers'

const primaryTheme = css`
  background: ${ ({ theme: { colors } }) => colors.accent };
  color: ${ ({ theme: { colors }}) => colors.white };
  transition: all ${ ({ theme: { animations } }) => animations.defaultTime };
  border: 2px solid ${({ theme: { colors } }) => colors.accent};
  
  &:hover {
    background: ${ ({ theme: { colors } }) => lighten(0.08, colors.accent) };
    border: 2px solid ${({ theme: { colors } }) => lighten(0.08, colors.accent)};
  }
`

const secondaryTheme = css`
  background: transparent;
  color: ${({ theme: { colors } }) => colors.secondary };
  transition: border ${({ theme: { animations } }) => animations.defaultTime };
  border: 2px solid ${({ theme: { colors } }) => colors.secondary };

  &:hover {
    border: 2px solid ${({ theme: { colors } }) => lighten(0.2, colors.secondary) };
  },
`

const plainTheme = css`
  background: ${({ theme: { colors } }) => colors.white };
  transition: background ${({ theme: { animations } }) => animations.defaultTime };
  padding: ${ms(0)};
  border-radius: ${ms(0)};

  &:hover {
    background: ${({ theme: { colors } }) => darken(0.02, colors.white) };
  }
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
