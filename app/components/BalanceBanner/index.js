// @flow
import React from 'react';
import styled, { withTheme } from 'styled-components';
import { lighten } from 'polished';
import { ms } from '../../styles/helpers';
import { H4 } from '../Heading/';
import TezosAmount from '../TezosAmount/';
import TezosAddress from '../TezosAddress/';
import TezosIcon from '../TezosIcon/';
import Tooltip from '../Tooltip/';
import Button from '../Button/';
import Update from '../Update/';
import ManagerAddressTooltip from '../Tooltips/ManagerAddressTooltip/';
import { findAccountIndex } from '../../utils/account';
import { MNEMONIC } from '../../constants/StoreTypes';

type Props = {
  storeTypes?: string,
  isReady: boolean,
  balance: number,
  publicKeyHash: string,
  onRefreshClick: () => {},
  isManagerAddress: boolean,
  theme: object,
  parentIndex?: number,
  parentIdentity?: object,
  delegatedAddress?: string,
  time?: Date
};

const Container = styled.header`
  padding: ${ms(0)} ${ms(4)};
  background-color: ${({ theme: { colors } }) => colors.accent};
`;

const Row = styled.div`
  margin: 0 0 ${ms(3)} 0;
`;

const TopRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  color: ${({ theme: { colors } }) => lighten(0.3, colors.accent)};
  opacity: ${({ isReady }) => (isReady ? '1' : '0.5')};
`;

const BottomRow = styled(Row)`
  color: ${({ theme: { colors } }) => colors.white};
  opacity: ${({ isReady }) => (isReady ? '1' : '0.5')};
`;

const AddressTitle = styled(H4)`
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.bold};
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0;
  line-height: 1.75;
  font-size: ${ms(2.2)};
`;

const AddressTitleIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const AddressInfo = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.9;

  @media (max-width: 1200px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Amount = styled(TezosAmount)`
  margin: 0 ${ms(2)} 0 0;
  padding: ${ms(-3)} 0;
  line-height: 1;
`;

const Delegate = styled.span`
  color: ${({ theme: { colors } }) => colors.white};
  font-size: ${ms(-1)};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.light};
  margin-right: 6px;
`;

const DelegateContainer = styled.div`
  display: flex;
`;

const Breadcrumbs = styled.div`
  font-size: ${ms(-1)};
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

function BalanceBanner(props: Props) {
  const {
    storeTypes,
    isReady,
    balance,
    publicKeyHash,
    onRefreshClick,
    theme,
    parentIndex,
    parentIdentity,
    isManagerAddress,
    time,
    delegatedAddress
  } = props;
  const smartAddressIndex = findAccountIndex(parentIdentity, publicKeyHash) + 1;
  const addressLabel =
    !isManagerAddress && smartAddressIndex
      ? `Delegated Address ${smartAddressIndex}`
      : 'Manager Address';

  const breadcrumbs = `Account ${parentIndex} > ${addressLabel}`;

  return (
    <Container>
      <TopRow isReady={isReady}>
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        <Update onClick={onRefreshClick} time={time} isReady={isReady} />
      </TopRow>
      <BottomRow isReady={isReady}>
        <AddressTitle>
          <AddressTitleIcon
            iconName={isManagerAddress ? 'manager' : 'smart-address'}
            size={ms(0)}
            color="white"
          />
          {addressLabel}

          {isManagerAddress && (
            <Tooltip position="bottom" content={ManagerAddressTooltip}>
              <Button buttonTheme="plain">
                <HelpIcon iconName="help" size={ms(0)} color="white" />
              </Button>
            </Tooltip>
          )}
        </AddressTitle>
        <AddressInfo>
          <TezosAddress
            address={publicKeyHash}
            weight={theme.typo.weights.light}
            color="white"
            text={publicKeyHash}
            size={ms(1.7)}
          />

          {isReady || storeTypes === MNEMONIC ? (
            <Amount
              color="white"
              size={ms(4.5)}
              amount={balance}
              weight="light"
              format={2}
              showTooltip
            />
          ) : null}
        </AddressInfo>
        {delegatedAddress && (
          <DelegateContainer>
            <Delegate>Delegated to </Delegate>
            <TezosAddress
              address={delegatedAddress}
              color="white"
              size={ms(-1)}
              weight={300}
            />
          </DelegateContainer>
        )}
      </BottomRow>
    </Container>
  );
}

BalanceBanner.defaultProps = {
  parentIdentity: null,
  parentIndex: 0
};

export default withTheme(BalanceBanner);
