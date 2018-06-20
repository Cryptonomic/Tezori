// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { darken } from 'polished';
import { ms } from '../styles/helpers';

import AddCircle from 'material-ui/svg-icons/content/add-circle';

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
  padding: ${ms(-2)} ${ms(2)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme: { colors } }) => colors.gray1};
`;

type Props = {
  accountBlock: Object, // TODO: type this
  openCreateAccountModal: Function,
  selectAccount: Function,
  selectedAccountHash: string
};

type State = {
  isExpanded: boolean
};

export default class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    isExpanded: false
  };

  renderTezosAmount = (
    accountId: string,
    selectedAccountHash: string,
    balance: number
  ) => {
    const isActive = accountId === selectedAccountHash;

    return (
      <Tezos isActive={isActive}>
        {balance}
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
    const { accountBlock, selectedAccountHash } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');
    const { isExpanded } = this.state;
    const isManagerActive = publicKeyHash === selectedAccountHash;

    return (
      <Container>
        <AddressLabel>Account 1</AddressLabel>
        <Address
          isActive={isManagerActive}
          onClick={this.handleManagerAddressClick}
        >
          <AddressFirstLine isActive={isManagerActive}>
            Manager Address
          </AddressFirstLine>
          <AddressSecondLine isActive={isManagerActive}>
            {this.renderTezosAmount(
              publicKeyHash,
              selectedAccountHash,
              accountBlock.get('balance')
            )}
          </AddressSecondLine>
        </Address>

        {isExpanded && (
          <Fragment>
            <AddressLabel>
              Smart Addresses
              <AddCircle
                style={{
                  fill: '#7B91C0',
                  height: '16px',
                  width: '20px'
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
                  key
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
