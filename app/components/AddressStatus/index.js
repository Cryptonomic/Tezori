// @flow
import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import LoaderSpinner from '../LoaderSpinner/';
import { wrapComponent } from '../../utils/i18n';

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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  isManager?: boolean,
  isActive?: boolean,
  status?: string,
  isSmart?: boolean,
  onClick?: () => {},
  t: () => {}
};

function AddressStatus(props: Props) {
  const { isManager, isActive, status, isSmart, onClick, t } = props;
  let text = '';
  if (isSmart) {
    text = t('components.addressStatus.deploying_title');
  } else {
    const typeText = t(
      isManager
        ? 'components.addressStatus.your_account'
        : 'components.addressStatus.new_address'
    );
    switch (status) {
      case statuses.CREATED:
      case statuses.FOUND: {
        text = t('components.addressStatus.retrieving_title', { typeText });
        break;
      }
      case statuses.PENDING:
        text = t('components.addressStatus.preparing_title', { typeText });
        break;
      default:
        break;
    }
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

export default wrapComponent(AddressStatus);
