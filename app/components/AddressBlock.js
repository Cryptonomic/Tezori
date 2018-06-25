// @flow
import React, { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken, lighten } from 'polished';
import { ms } from '../styles/helpers';

import AddCircle from 'material-ui/svg-icons/content/add-circle';
import HelpIcon from 'material-ui/svg-icons/action/help'
import ManagerIcon from 'material-ui/svg-icons/hardware/device-hub'
import Tooltip from './Tooltip'
import { H3 } from './Heading'
import TezosAmount from './TezosAmount';
import { formatAmount } from '../utils/currancy'

import CreateAccountModal from './CreateAccountModal';
import tezosLogo from '../../resources/tezosLogo.png';

const Container = styled.div`
  overflow: hidden;
`;

const Tezos = styled.span`
  display: flex;
  align-items: center;
  font-size: ${ms(-1)};
  font-weight: 500;
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.primary};
`;

const Amount = styled(TezosAmount)`
  font-weight: 500;
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.primary};
`;

const TezosSymbol = styled.img`
  height: ${ms(0)};
  filter: ${({ isActive }) =>
    isActive ? 'brightness(0.5%) invert(100%)' : 'brightness(0%)'};
`;

const Address = styled.div`
  border-bottom: 1px solid
    ${({ theme: { colors } }) => darken(0.1, colors.white)};
  padding: ${ms(-2)} ${ms(2)};
  cursor: pointer;
  background: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.accent : colors.white};
`;

const AddressFirstLine = styled.span`
  font-weight: 500;
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.secondary};
`;

const AddressSecondLine = styled.span`
  color: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.white : colors.primary};
  font-weight: 300;
`;

const AddressLabel = styled.div`
  padding: ${ms(-1)} ${ms(2)};
  display: flex;
  font-weight: 500;
  color: ${({ theme: { colors } }) => colors.primary};
  align-items: center;
  justify-content: space-between;
  background: ${({ theme: { colors } }) => colors.gray1};
`;

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
`

const AccountTitle = styled(H3)`
  font-size: ${ms(1)};
  font-weight: 500;
  padding: 0 ${ms(-1)} 0 0;
  display: inline-block;
  border-right: 2px solid ${({ theme: { colors } }) => darken(0.05, colors.gray1)};
`

type Props = {
  accountBlock: Object, // TODO: type this
  openCreateAccountModal: Function,
  selectAccount: Function,
  selectedAccountHash: string,
  accountIndex: number,
  theme: Object,
};

type State = {
  isExpanded: boolean
};

class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    isExpanded: false
  };

  renderTezosAmount = (
    accountId: string,
    selectedAccountHash: string,
    balance: number,
    parent
  ) => {
    const isActive = accountId === selectedAccountHash;

    return (
      <Tezos isActive={isActive}>
        {
          parent
            ?
            (
              <Tooltip position="right" title={ formatAmount(balance) }>
                <Amount isActive={isActive} size={ ms(-1) } amount={ formatAmount(balance, 2) } iconName="" />
              </Tooltip>
            )
            : <Amount isActive={isActive} size={ ms(-1) } amount={ formatAmount(balance) } iconName="" />

        }
        <TezosSymbol alt="tez" src={tezosLogo} isActive={isActive} />
      </Tezos>
    );
  };

  handleManagerAddressClick = () => {
    const { accountBlock } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');
    this.setState(prevState => ({
      isExpanded: !prevState.isExpanded
    }));

    this.selectAccount(publicKeyHash, publicKeyHash);
  };

  selectAccount = (accountHash: string, parentHash: string) => {
    this.props.selectAccount(accountHash, parentHash);
  };

  render() {
    const { accountBlock, selectedAccountHash, accountIndex, theme } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');
    const { isExpanded } = this.state;
    const isManagerActive = publicKeyHash === selectedAccountHash;

    return (
      <Container>
        <AddressLabel>
          <AccountTitle>{`Account ${accountIndex}`}</AccountTitle>
        </AddressLabel>
        <Address
          isActive={isManagerActive}
          onClick={this.handleManagerAddressClick}
        >
          <AddressFirstLine isActive={isManagerActive}>
            <AddressesTitle>
              <ManagerIcon style={{
                width: ms(0),
                height: ms(0),
                marginRight: ms(-10),
                fill: isManagerActive ? theme.colors.white : lighten(0.1, theme.colors.secondary)
              }}/>
              Manager Address
              <Tooltip position="right" title="lorem ispum dolor">
                <HelpIcon style={{
                  width: ms(0),
                  height: ms(0),
                  marginLeft: ms(-6),
                  fill: isManagerActive ? theme.colors.white : lighten(0.1, theme.colors.secondary)
                }} />
              </Tooltip>
            </AddressesTitle>

          </AddressFirstLine>
          <AddressSecondLine isActive={isManagerActive}>
            {this.renderTezosAmount(
              publicKeyHash,
              selectedAccountHash,
              accountBlock.get('balance'),
              true
            )}
          </AddressSecondLine>
        </Address>

        {isExpanded && (
          <Fragment>
            <AddressLabel>
              <AddressesTitle>
                Smart Addresses
                <Tooltip position="right" title="lorem ispum dolor">
                  <HelpIcon style={{
                    width: ms(0),
                    height: ms(0),
                    marginLeft: ms(-6),
                    fill: lighten(0.1, theme.colors.secondary)
                  }} />
                </Tooltip>
              </AddressesTitle>

              <AddCircle
                style={{
                  fill: '#7B91C0',
                  height: ms(1),
                  width: ms(1)
                }}
                onClick={this.props.openCreateAccountModal}
              />
            </AddressLabel>

            {accountBlock.get('accounts').map((smartAddress, index) => {
              const smartAddressId = smartAddress.get('accountId');
              const isSmartActive = smartAddressId === selectedAccountHash;
              const smartAddressBalance = smartAddress.get('balance');
              return (
                <Address
                  key={ smartAddress.get('accountId') }
                  isActive={isSmartActive}
                  onClick={() =>
                    this.selectAccount(smartAddressId, publicKeyHash)
                  }
                >
                  <AddressFirstLine isActive={isSmartActive}>
                    {`Smart Address ${index + 1}`}
                  </AddressFirstLine>
                  <AddressSecondLine isActive={isSmartActive}>
                    {this.renderTezosAmount(
                      smartAddressId,
                      selectedAccountHash,
                      smartAddressBalance
                    )}
                  </AddressSecondLine>
                </Address>
              );
            })}
          </Fragment>
        )}
        <CreateAccountModal />
      </Container>
    );
  }
}

export default withTheme(AddressBlock)
