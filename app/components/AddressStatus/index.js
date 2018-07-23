// @flow
import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import LoaderSpinner from '../LoaderSpinner/';

import * as statuses from '../../constants/StatusTypes';

const Container = styled.div`
  border-bottom: 1px solid
    ${({ theme: { colors } }) => darken(0.1, colors.white)};
  padding: ${ms(-1)} ${ms(2)};
  cursor: pointer;
  background: ${({ isActive, theme: { colors } }) => {
    return isActive ? colors.accent : colors.white;
  }};
  opacity: 0.95;
  display: flex;
  align-items: center;
`;

const Title = styled.span`
  line-height: 3;
  color: ${({ isActive }) => {
    return isActive ? '#ffffff' : '#94a9d1';
  }};
  font-size: ${ms(-0.8)};
  opacity: ${({ isActive }) => {
    return isActive ? '0.70' : '1';
  }};
`;

type Props = {
  isManager?: boolean,
  isActive?: boolean,
  address?: object,
  onClick?: Function
};

export default function AddressStatus(props: Props) {
  const { isManager, isActive, address, onClick } = props;

  const status = address.get('status');

  let text = '';
  switch (status) {
    case statuses.CREATED:
    case statuses.FOUND:
      text = isManager
        ? 'Retrieving your account...'
        : 'Retrieving new address...';
      break;
    case statuses.PENDING:
      text = isManager
        ? 'Preparing your account...'
        : 'Preparing new address...';
      break;
    default:
      break;
  }

  return (
    <Container isActive={isActive} onClick={onClick}>
      <LoaderSpinner
        size="sm"
        styles={{
          color: isManager || isActive ? '#ffffff' : '#94a9d1',
          opacity: isManager || isActive ? '0.70' : '1'
        }}
      />
      <Title isActive={isManager || isActive}>{text}</Title>
    </Container>
  );
}
