// @flow

import React from 'react';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';

import { ms } from '../../styles/helpers';

const primaryTheme = css`
  background: ${({ theme: { colors } }) => colors.accent};
  color: ${({ theme: { colors } }) => colors.white};
  transition: all ${({ theme: { animations } }) => animations.defaultTime};
  border: 2px solid ${({ theme: { colors } }) => colors.accent};

  &:hover {
    background: ${({ theme: { colors } }) => lighten(0.08, colors.accent)};
    border: 2px solid ${({ theme: { colors } }) => lighten(0.08, colors.accent)};
  }
`;

const secondaryTheme = css`
  background: transparent;
  color: ${({ theme: { colors } }) => colors.secondary};
  transition: border ${({ theme: { animations } }) => animations.defaultTime};
  border: 2px solid ${({ theme: { colors } }) => colors.secondary};

  &:hover {
    border: 2px solid ${({ theme: { colors } }) =>
      lighten(0.2, colors.secondary)};
  },
`;

const plainTheme = css`
  background: transparent;
  transition: background
    ${({ theme: { animations } }) => animations.defaultTime};
  padding: 0;
  outline: none;
`;

const chooseTheme = (buttonTheme: 'primary' | 'secondary' | 'plain') => {
  switch (buttonTheme) {
    case 'primary':
      return primaryTheme;
    case 'secondary':
      return secondaryTheme;
    case 'plain':
      return plainTheme;
    default:
      return primaryTheme;
  }
};

const StyledButton = styled.button`
  padding: ${ms(0)} ${ms(6)};
  border: 0;
  border-radius: ${ms(3)};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  font-size: ${ms(0)};
  font-weight: 300;
  display: inline-block;
  cursor: pointer;
  -webkit-app-region: no-drag;
  ${({ small }) =>
    small &&
    css`
      padding: ${ms(-5)} ${ms(6)};
      font-size: ${ms(-1)};
    `}
  
  ${({ disabled }) =>
    disabled &&
    css`
      opacity: 0.5;
      pointer-events: none;
      &:hover {
        opacity: 0.5;
      }
    `}
  
  ${({ buttonTheme }) => chooseTheme(buttonTheme)};
`;

type Props = {
  className?: string,
  children?: mixed,
  disabled?: boolean,
  buttonTheme: 'primary' | 'secondary' | 'plain',
  small?: boolean,
  type?: string,
  onClick?: Function
};

function Button(props: Props) {
  const {
    className,
    children,
    disabled,
    buttonTheme,
    type,
    small,
    onClick,
    ...restOfProps
  } = props;
  return (
    <StyledButton
      onClick={onClick}
      type={type || 'button'}
      buttonTheme={buttonTheme}
      small={small}
      disabled={disabled}
      className={className}
      {...restOfProps}
    >
      {children}
    </StyledButton>
  );
}

export default Button;
