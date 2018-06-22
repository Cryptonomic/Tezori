import React from 'react';
import styled from 'styled-components';
import TezosIcon from '../TezosIcon';
import { ms } from '../../styles/helpers';

type Props = {
  amount: number,
  color: string,
  iconName: string,
  size: any,
  weight: string
};

const Amount = styled.span`
  color: ${({ color, theme: { colors } }) => colors[color]};
  font-size: ${({ size }) => size};
  font-weight: ${({
    weight = 'normal',
    theme: {
      typo: { weights }
    }
  }) => weights[weight]};
  display: inline-flex;
  align-items: center;
  letter-spacing: 0.6px;

  span {
    line-height: 0;
  }
`;

const Icon = styled(TezosIcon)`
  line-height: 1;
`;

const TezosAmount = (props: Props) => {
  const { size, color, amount, iconName, weight, className } = props;
  return (
    <Amount className={className} color={color} size={size} weight={weight}>
      <span>{amount.toFixed(2)}</span>
      <Icon size={size} color={color} iconName={iconName} />
    </Amount>
  );
};

TezosAmount.defaultProps = {
  amount: 0,
  color: 'primary',
  iconName: 'tezos',
  size: ms(0),
  weight: 'normal'
};

export default TezosAmount;
