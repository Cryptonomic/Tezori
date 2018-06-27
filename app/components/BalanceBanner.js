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
  parentIdentity?: Object
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
`;

const AddressTitleIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const AddressHash = styled(H4)`
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0 ${ms(1)} 0 0;
  font-size: 2vw
`;

const AddressInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Amount = styled(TezosAmount)`
  margin: 0 0 0 ${ms(2)};
  line-height: 1;
`;

const Delegate = styled.span`
  color: ${ ({ theme: { colors } }) => colors.white };
  font-size: ${ms(-1)};
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
  const { isReady, balance, publicKeyHash, onRefreshClick, theme, parentIndex, parentIdentity, isManagerAddress } = props;
  const smartAddressIndex = findAccountIndex(parentIdentity, publicKeyHash) + 1;
  const addressLabel = !isManagerAddress && smartAddressIndex  
    ? `Delegated Address ${smartAddressIndex}` 
    : 'Manager Address';

  const breadcrumbs = `Account ${parentIndex} > ${addressLabel}`;

  return (
    <Container isReady={ isReady }>
      <TopRow isReady={ isReady }>
        <Breadcrumbs>
          {breadcrumbs}
        </Breadcrumbs>

        {
          isReady
            ?
            (
              <RefreshIcon
                style={{
                  fill: 'white',
                  height: ms(2),
                  width: ms(2),
                  cursor: 'pointer'
                }}
                onClick={onRefreshClick}
              />
            )
            :
            (
              <Refresh
                style={{
                  fill: 'white',
                  height: ms(2),
                  width: ms(2),
                  cursor: 'pointer'
                }}
                onClick={onRefreshClick}
              />
            )
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
          <TezosAddress size={ms(1)} address={publicKeyHash} weight={theme.typo.weights.light} color={theme.colors.white} />
          <CopyIcon text={publicKeyHash} color='white' />
          <Amount size={ms(4)} color="white" amount={ balance } weight="light" showTooltip />
        </AddressInfo>
        {!isManagerAddress && <Delegate>Delegated to the Manager Address</Delegate>}
      </BottomRow>
    </Container>
  );
}

export default withTheme(BalanceBanner)

/*
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
import ManagerAddressTooltip from "./Tooltips/ManagerAddressTooltip";
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
  parentIdentity?: Object
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
`;

const AddressTitleIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const AddressHash = styled(H4)`
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0 ${ms(1)} 0 0;
  font-size: 2vw
`;

const AddressInfo = styled.div`
  display: flex;
  align-items: center;
`;

const Amount = styled(TezosAmount)`
  margin: 0 0 0 ${ms(2)};
  line-height: 1;
`;

const Breadcrumbs = styled.div`
  font-size: ${ms(-1)};
`


  const Refresh = styled(RefreshIcon)`
-webkit-animation:spin 0.5s linear infinite;
-moz-animation:spin 0.5s linear infinite;
animation:spin 0.5s linear infinite;

@-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
`


function BalanceBanner(props: Props) {
  const { isReady, balance, publicKeyHash, onRefreshClick, theme, parentIndex, parentIdentity, isManagerAddress } = props;
  const smartAddressIndex = findAccountIndex(parentIdentity, publicKeyHash) + 1;
  const addressLabel = !isManagerAddress && smartAddressIndex
  ? `Smart Address ${smartAddressIndex}`
  : 'Manager Address';

  const breadcrumbs = `Account ${parentIndex} > ${addressLabel}`;

  return (
  <Container isReady={ isReady }>
  <TopRow isReady={ isReady }>
  <Breadcrumbs>
  {breadcrumbs}
  </Breadcrumbs>

  {
    isReady
      ?
      (
        <RefreshIcon
          style={{
                  fill: 'white',
                  height: ms(2),
                  width: ms(2),
                  cursor: 'pointer'
                }}
          onClick={onRefreshClick}
        />
      )
      :
      (
        <Refresh
          style={{
                  fill: 'white',
                  height: ms(2),
                  width: ms(2),
                  cursor: 'pointer'
                }}
          onClick={onRefreshClick}
        />
      )
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
  <TezosAddress address={publicKeyHash} size={ms(1)}  weight={theme.typo.weights.light} color={theme.colors.white} />
  <Amount size={ms(4)} color="white" amount={ balance } weight="light" showTooltip />
  </AddressInfo>
  </BottomRow>
  </Container>
  );
}

export default withTheme(BalanceBanner)

*/

