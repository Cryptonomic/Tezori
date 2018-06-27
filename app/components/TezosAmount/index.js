import * as React from 'react';
import styled from 'styled-components';
import TezosIcon from '../TezosIcon';
import Tooltip from '../Tooltip';
import { formatAmount } from "../../utils/currancy";
import { ms } from '../../styles/helpers';

type Props = {
  amount: number,
  color: string,
  iconName?: string,
  size: any,
  weight: string,
  format: number,
  content?: any,
};

const Amount = styled.span`
  color: ${({ color, theme: { colors } }) => color ? colors[color] : colors.primary};
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
  const { size, color, amount, iconName, weight, className, showTooltip ,format, content} = props;
  return showTooltip ? (
    <Tooltip position="right" content={formatAmount(amount)}>
      <Amount className={className} color={color} size={size} weight={weight}>
        { format === 6 ? formatAmount(amount) : `~${formatAmount(amount, format)}` }
        {
          iconName
          && <Icon size={size} color={color} iconName={iconName}/>
        }
      </Amount>
    </Tooltip>
    ) : (
    <Amount className={className} color={color} size={size} weight={weight} format={format}>
      { format === 6 ? formatAmount(amount) : `~${formatAmount(amount, format)}` }
      {
        iconName
          && <Icon size={size} color={color} iconName={iconName}/>
      }
    </Amount>
  );
};

TezosAmount.defaultProps = {
  amount: 0,
  iconName: 'tezos',
  size: ms(0),
  weight: 'normal',
  color: 'primary',
  format: 6,
};

export default TezosAmount;
