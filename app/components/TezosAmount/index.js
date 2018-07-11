import * as React from 'react';
import styled from 'styled-components';
import { clipboard } from 'electron';
import TezosIcon from '../TezosIcon';
import CopyIcon from '../CopyIcon';
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
  -webkit-app-region: no-drag;
  line-height: 1;

  span {
    line-height: 0;
  }
`;

const Icon = styled(TezosIcon)`
  line-height: 1;
`;

const CopyImage = styled.img`
  margin-left: ${ms(-4)};
  with: ${ms(1)};
  height: ${ms(1)};
  cursor: pointer;
  fill: ${ ({ theme: { colors } }) => colors.gray2 };
`
const CopyContent = styled.span`
  display: flex;
  alignItems: center;
  font-size: ${ms(0)};
`
const Content = props => {
  const { formatedBalance } = props
  return (
    <CopyContent>
      {formatedBalance}
      <CopyIcon text={formatedBalance} color='primary' />
    </CopyContent>
  )
}

const copyToClipboard = text => {
  clipboard.writeText(text)
}

const getFormatAmount = ({ amount, format, rounded, positive, fee }) => {
  const formatedBalance = formatAmount(amount, format)

  if (positive) {
    return `+${formatedBalance}`
  } else if (fee) {
    return `-${formatedBalance}`
  } else if (rounded) {
    return `~${formatedBalance}`
  } else {
    return formatedBalance
  }
}

const TezosAmount = (props: Props) => {
  const { size, color, amount, iconName, weight, className, showTooltip ,format, content, rounded, positive, fee } = props;
  const formatedBalance = formatAmount(amount, format)
  return showTooltip ? (
    <Tooltip position="bottom" content={<Content formatedBalance={formatedBalance} />}>
      <Amount className={className} color={color} size={size} weight={weight} rounded>
        { getFormatAmount({ amount, format, rounded, positive }) }
        {
          iconName
          && <Icon size={size} color={color} iconName={iconName}/>
        }
      </Amount>
    </Tooltip>
    ) : (
    <Amount className={className} color={color} size={size} weight={weight} format={format} fee={fee}>
      { getFormatAmount({ amount, format, rounded, positive, fee }) }
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
  weight: 'bold',
  color: 'primary',
  format: 6,
};

export default TezosAmount;
