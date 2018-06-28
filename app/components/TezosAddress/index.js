import React from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

type Props = {
  address: string,
  weight?: string | number,
  className?: string,
  color?: string,
  size?: string,
};

const Address = styled.span`
  display: inline-block;
  color: ${({color, theme: {colors}}) => color ? color : colors.primary};
  font-weight: ${({weight, theme: {typo: {weights}}}) => weight ? weight : weights.normal};
  font-size: ${({size}) => size ? size : ms(0)};
`

const FirstPart = styled.span`
  font-weight: ${({theme: {typo: {weights}}}) => weights.bold};
`


const TezosAddress = (props: Props) => {
  const { className, address, weight, size, color } = props;
  return (
    <Address className={className} weight={weight} color={color} size={size}>
      <FirstPart>{address.slice(0, 3)}</FirstPart>
      <span>{address.slice(3)}</span>
    </Address>
  );
};

TezosAddress.defaultProps = {
  weight: 'normal',
};

export default TezosAddress;
