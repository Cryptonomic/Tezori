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

type Props = {
  isManager?: boolean,
  isActive?: boolean,
  balance?: number,
  index?: number,
  onClick?: () => {}
};

export default function Address(props: Props) {
  const { isManager, isActive, balance, index, onClick } = props;
  const firstLine = isManager ? (
    <AddressFirstLine isActive={isActive}>
      <AddressesTitle>
        <AddressLabelIcon
          iconName="manager"
          size={ms(0)}
          color={isActive ? 'white' : 'secondary'}
        />
        Manager Address
        <Tooltip position="bottom" content={ManagerAddressTooltip}>
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
  ) : (
    <AddressFirstLine isActive={isActive}>
      <AddressesTitle>
        <AddressLabelIcon
          iconName="smart-address"
          size={ms(0)}
          color={isActive ? 'white' : 'secondary'}
        />
        {`Delegated Address ${index + 1}`}
      </AddressesTitle>
    </AddressFirstLine>
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
