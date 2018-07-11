// @flow
import React from 'react';
import styled, {withTheme} from 'styled-components';
import { lighten } from 'polished';
import { ms } from '../styles/helpers';
import { H4 } from './Heading';
import TezosAmount from './TezosAmount';
import TezosAddress from './TezosAddress';
import TezosIcon from './TezosIcon';
import Tooltip from './Tooltip';
import Button from './Button';
import Update from './Update'
import ManagerAddressTooltip from "./Tooltips/ManagerAddressTooltip";
import CopyIcon from './CopyIcon';

import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';
import { findAccountIndex } from '../utils/account';

type Props = {
  isReady: boolean,
  balance: number,
  publicKeyHash: string,
  onRefreshClick: Function,
  isManagerAddress: boolean,
  theme: Object,
  parentIndex?: number,
  parentIdentity?: Object,
  selectedParentHash: string,
};

const Container = styled.header`
  padding: ${ms(0)} ${ms(4)};
  background-color: ${({ isReady, theme: { colors } }) =>
  isReady ? colors.accent : colors.disabled};
`;

const Row = styled.div`
  margin: 0 0 ${ms(3)} 0;
`;

const TopRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  color: ${({ isReady, theme: { colors } }) =>
  isReady ? lighten(0.3, colors.accent) : colors.white};
`;

const BottomRow = styled(Row)`
  color: ${({ theme: { colors } }) => colors.white};
`;

const AddressTitle = styled(H4)`
  font-weight: ${({ theme: { typo: {weights} } }) => weights.bold};
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0;
  line-height: 1.75;
  font-size: ${ms(2.2)}
`;

const AddressTitleIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const AddressHash = styled(H4)`
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0 ${ms(1)} 0 0;
  font-size: ${ms(3)};
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
  color: ${ ({ theme: { colors } }) => colors.white };
  font-size: ${ms(-1)};
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.light };
  margin-right: 6px;
`

const DelegateContainer = styled.div`
  display: flex;
`

const Breadcrumbs = styled.div`
  font-size: ${ms(-1)};
`


const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const Refresh = styled(RefreshIcon)`
  -webkit-animation:spin 0.5s linear infinite;
  -moz-animation:spin 0.5s linear infinite;
  animation:spin 0.5s linear infinite;

  @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
  @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
`


function BalanceBanner(props: Props) {
  const { isReady, balance, publicKeyHash, onRefreshClick, theme, parentIndex, parentIdentity, selectedParentHash, isManagerAddress, time } = props;
  const smartAddressIndex = findAccountIndex(parentIdentity, publicKeyHash) + 1;
  const addressLabel = !isManagerAddress && smartAddressIndex
    ? `Delegated Address ${smartAddressIndex}`
    : 'Manager Address';

  const breadcrumbs = `Account ${parentIndex} > ${addressLabel}`;
  const formatedBalance = balance.toFixed(6)
  return (
    <Container isReady={ isReady }>
      <TopRow isReady={ isReady }>
        <Breadcrumbs>
          {breadcrumbs}
        </Breadcrumbs>
        { isReady
            ? <Update onClick={onRefreshClick} time={time} />
            : <Refresh
                style={{
                  fill: 'white',
                  height: ms(2),
                  width: ms(2),
                  cursor: 'pointer',
                }}
                onClick={onRefreshClick}
              />
        }
      </TopRow>
      <BottomRow>
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
                <HelpIcon
                  iconName="help"
                  size={ms(0)}
                  color="white"
                />
              </Button>
            </Tooltip>
          )}
        </AddressTitle>
        <AddressInfo>
          <TezosAddress
            address={publicKeyHash}
            weight={theme.typo.weights.light}
            color={'white'}
            text={publicKeyHash}
            size={ms(1.7)}
          />
          <Amount
            color="white"
            size={ms(4.5)}
            amount={balance}
            weight="light"
            format={2}
            rounded
            showTooltip
          />
        </AddressInfo>
        { publicKeyHash !== selectedParentHash &&
          <DelegateContainer>
            <Delegate>Delegated to the Manager Address:</Delegate>
            <TezosAddress address={selectedParentHash} color={'white'} size={ms(-1)} />
          </DelegateContainer> }
      </BottomRow>
    </Container>
  );
}

BalanceBanner.defaultProps = {
  parentIdentity: null,
  parentIndex: 0
}

export default withTheme(BalanceBanner)
