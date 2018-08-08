import * as React from 'react';
import styled from 'styled-components';
import TezosIcon from '../TezosIcon';
import CopyIcon from '../CopyIcon';
import Tooltip from '../Tooltip';
import { formatAmount } from '../../utils/currancy';
import { ms } from '../../styles/helpers';

const Amount = styled.span`
  color: ${({ color, theme: { colors } }) =>
    color ? colors[color] : colors.primary};
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
  -webkit-app-region: no-drag;

  span {
    line-height: 0;
  }
`;

const Icon = styled(TezosIcon)`
  line-height: 1;
`;

const CopyContent = styled.span`
  display: flex;
  alignitems: center;
  font-size: ${ms(0)};
`;

type ContentProps = {
  formatedBalance: string
};

const Content = (props: ContentProps) => {
  const { formatedBalance } = props;
  return (
    <CopyContent>
      {formatedBalance}
      <CopyIcon text={formatedBalance} color="primary" />
    </CopyContent>
  );
};

type Props = {
  amount: number,
  color: string,
  iconName?: string,
  size?: string,
  weight: string,
  format: number,
  className?: string,
  showTooltip?: boolean
};

const TezosAmount = (props: Props) => {
  const {
    size,
    color,
    amount,
    iconName,
    weight,
    className,
    showTooltip,
    format
  } = props;
  const formatedBalance = `${formatAmount(amount)}`;
  return showTooltip ? (
    <Tooltip
      position="bottom"
      content={<Content formatedBalance={formatedBalance} />}
    >
      <Amount className={className} color={color} size={size} weight={weight}>
        {format === 6
          ? formatAmount(amount)
          : `~${formatAmount(amount, format)}`}
        {iconName && <Icon size={size} color={color} iconName={iconName} />}
      </Amount>
    </Tooltip>
  ) : (
    <Amount
      className={className}
      color={color}
      size={size}
      weight={weight}
      format={format}
    >
      {format === 6 ? formatAmount(amount) : `~${formatAmount(amount, format)}`}
      {iconName && <Icon size={size} color={color} iconName={iconName} />}
    </Amount>
  );
};

TezosAmount.defaultProps = {
  amount: 0,
  iconName: 'tezos',
  size: ms(0),
  weight: 'bold',
  color: 'primary',
  format: 6
};

export default TezosAmount;
