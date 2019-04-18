import React from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import CopyIcon from '../CopyIcon';

type Props = {
  address: string,
  weight?: string | number,
  className?: string,
  color?: string,
  size?: string,
  text?: string,
  color2?: string
};

const Address = styled.span`
  display: flex;
  align-items: center;
  color: ${({ color, theme: { colors } }) => colors[color]};
  font-weight: ${({
    weight,
    theme: {
      typo: { weights }
    }
  }) => weight || weights.normal};
  font-size: ${({ size }) => size || ms(2)};
  margin: 0 0 0 0;
  -webkit-app-region: no-drag;
`;

const FirstPart = styled.span`
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.bold};
  color: ${({ color, theme: { colors } }) => colors[color]};
`;

const SelectableText = {
  userSelect: 'text',
  cursor: 'text'
};

const TezosAddress = (props: Props) => {
  const { className, address, weight, size, color, text, color2 } = props;
  return (
    <Address
      className={className}
      weight={weight}
      color={color}
      size={size}
      text={text}
    >
      <span>
        <FirstPart style={SelectableText} color={color2}>
          {address.slice(0, 3)}
        </FirstPart>
        <span style={SelectableText}>{address.slice(3)}</span>
      </span>
      {text && <CopyIcon text={text} color={color} />}
    </Address>
  );
};

TezosAddress.defaultProps = {
  weight: 'normal',
  color: 'primary'
};

export default TezosAddress;
