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
  const splicedAddress = address.match(/^([tT][zZ]1)(.+)/)

  return splicedAddress && splicedAddress.length === 3 && (
    <Address className={className} weight={weight} color={color} size={size}>
      <FirstPart>{splicedAddress[1]}</FirstPart>
      <span>{splicedAddress[2]}</span>
    </Address>
  )
};

TezosAddress.defaultProps = {
  weight: 'normal',
};

export default TezosAddress;
