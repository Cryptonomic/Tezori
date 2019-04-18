// @flow
import React from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { ms } from '../../styles/helpers';
import TezosIcon from './../TezosIcon/';
import Tooltip from './../Tooltip/';
import Button from './../Button/';
import TezosAmount from './../TezosAmount/';
import ManagerAddressTooltip from './../Tooltips/ManagerAddressTooltip/';
import { wrapComponent } from '../../utils/i18n';

const Container = styled.div`
  border-bottom: 1px solid
    ${({ theme: { colors } }) => darken(0.1, colors.white)};
  padding: ${ms(-2)} ${ms(2)};
  cursor: pointer;
  background: ${({ isActive, theme: { colors } }) => {
    return isActive ? colors.accent : colors.white;
  }};
  display: flex;
  flex-direction: column;
`;

const AddressFirstLine = styled.span`
  font-weight: ${({ theme: { typo } }) => typo.weights.bold};
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.secondary};
`;

const AddressSecondLine = styled.span`
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.primary};
  font-weight: ${({ theme: { typo } }) => typo.weights.light};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddressLabelIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.5;
`;

const AddressLabel = styled.div`
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const getFirstLine = (isManager, isContract, isActive, index, accountId, t) => {
  if (isManager) {
    return (
      <AddressFirstLine isActive={isActive}>
        <AddressesTitle>
          <AddressLabelIcon
            iconName="manager"
            size={ms(0)}
            color={isActive ? 'white' : 'secondary'}
          />
          <AddressLabel>{t('components.address.manager_address')}</AddressLabel>
          <Tooltip position="bottom" content={<ManagerAddressTooltip />}>
            <Button buttonTheme="plain">
              <HelpIcon
                iconName="help"
                size={ms(0)}
                color={isActive ? 'white' : 'secondary'}
              />
            </Button>
          </Tooltip>
        </AddressesTitle>
      </AddressFirstLine>
    );
  }

  let displayTxt = t('components.address.delegated_address', {
    index: index + 1
  });
  if (isContract) {
    displayTxt = `${accountId.slice(0, 6)}...${accountId.slice(
      accountId.length - 6,
      accountId.length
    )}`;
  }

  return (
    <AddressFirstLine isActive={isActive}>
      <AddressesTitle>
        <AddressLabelIcon
          iconName="smart-address"
          size={ms(0)}
          color={isActive ? 'white' : 'secondary'}
        />
        {displayTxt}
      </AddressesTitle>
    </AddressFirstLine>
  );
};

type Props = {
  isManager?: boolean,
  isActive?: boolean,
  balance?: number,
  index?: number,
  accountId?: string,
  onClick?: () => {},
  t: () => {}
};

function Address(props: Props) {
  const {
    isManager,
    isContract,
    isActive,
    balance,
    index,
    accountId,
    onClick,
    t
  } = props;
  const firstLine = getFirstLine(
    isManager,
    isContract,
    isActive,
    index,
    accountId,
    t
  );

  const amountProps = {
    color: isActive ? 'white' : 'primary',
    amount: balance
  };

  if (isManager) {
    amountProps.size = ms(-0.7);
  }

  return (
    <Container isActive={isActive} onClick={onClick}>
      {firstLine}
      <AddressSecondLine isActive={isActive}>
        <TezosAmount {...amountProps} />
      </AddressSecondLine>
    </Container>
  );
}

export default wrapComponent(Address);
