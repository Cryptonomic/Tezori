// @flow
import styled, { css } from 'styled-components';

import { ms } from '../../styles/helpers';

const base = css`
  color: ${({ theme: { colors } }) => colors.primary};
  font-family: ${({ theme }) => theme.typo.fontFamily.primary};
  font-size: ${ms(3)};
  font-weight: 300;
  margin: 0;
`;

export const H1 = styled.h1`
  ${base}
  font-size: ${ms(5)};
`;

export const H2 = styled.h2`
  ${base}
  font-size: ${ms(4)};
`;

export const H3 = styled.h3`
  ${base}
  font-size: ${ms(3)};
`;

export const H4 = styled.h4`
  ${base}
  font-size: ${ms(2)};
`;
export const H5 = styled.h5`
  ${base}
  font-size: ${ms(1)};
`;

export const H6 = styled.h6`
  ${base}
  font-size: ${ms(0)};
`;
