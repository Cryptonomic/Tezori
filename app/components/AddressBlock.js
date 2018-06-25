// @flow
import React, { Component, Fragment } from 'react';
import styled, { withTheme } from 'styled-components';
import { darken } from 'polished';
import { ms } from '../styles/helpers';

import TezosIcon from './TezosIcon';
import Tooltip from './Tooltip';
import { H3 } from './Heading';
import TezosAmount from './TezosAmount';

import CreateAccountModal from './CreateAccountModal';

const Container = styled.div`
  overflow: hidden;
`;

const Address = styled.div`
  border-bottom: 1px solid
    ${({ theme: { colors } }) => darken(0.1, colors.white)};
  padding: ${ms(-2)} ${ms(2)};
  cursor: pointer;
  background: ${({ isActive, theme: { colors } }) =>
    isActive ? colors.accent : colors.white};
  display: flex;
  flex-direction: column;
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

const AddressLabelIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const AddressesTitle = styled.div`
  display: flex;
  align-items: center;
`;

const AccountTitle = styled(H3)`
  font-size: ${ms(1)};
  font-weight: 500;
  padding: 0 ${ms(-1)} 0 0;
  display: inline-block;
  border-right: 2px solid
    ${({ theme: { colors } }) => darken(0.05, colors.gray1)};
`;

type Props = {
  accountBlock: Object, // TODO: type this
  openCreateAccountModal: Function,
  selectAccount: Function,
  selectedAccountHash: string,
  accountIndex: number,
  theme: Object
};

type State = {
  isExpanded: boolean
};

class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    isExpanded: false
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
    const { accountBlock, selectedAccountHash, accountIndex } = this.props;
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
              <AddressLabelIcon
                iconName="manager"
                size={ms(0)}
                color={isManagerActive ? 'white' : 'secondary'}
              />
              Manager Address
              <Tooltip position="right" title="lorem ispum dolor">
                <HelpIcon
                  iconName="help"
                  size={ms(0)}
                  color={isManagerActive ? 'white' : 'secondary'}
                />
              </Tooltip>
            </AddressesTitle>
          </AddressFirstLine>
          <AddressSecondLine isActive={isManagerActive}>
            <TezosAmount
              color={
                publicKeyHash === selectedAccountHash ? 'white' : 'primary'
              }
              showTooltip
              amount={accountBlock.get('balance')}
            />
          </AddressSecondLine>
        </Address>

        {isExpanded && (
          <Fragment>
            <AddressLabel>
              <AddressesTitle>
                Smart Addresses
                <Tooltip position="right" title="lorem ispum dolor">
                  <HelpIcon iconName="help" size={ms(0)} color="secondary" />
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
                  key
                  isActive={isSmartActive}
                  onClick={() =>
                    this.selectAccount(smartAddressId, publicKeyHash)
                  }
                >
                  <AddressFirstLine isActive={isSmartActive}>
                    <AddressesTitle>
                      <AddressLabelIcon
                        iconName="smart-address"
                        size={ms(0)}
                        color={isSmartActive ? 'white' : 'secondary'}
                      />
                      {`Smart Address ${index + 1}`}
                    </AddressesTitle>
                  </AddressFirstLine>
                  <AddressSecondLine isActive={isSmartActive}>
                    <TezosAmount
                      color={isSmartActive ? 'white' : 'primary'}
                      amount={smartAddressBalance}
                    />
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

export default withTheme(AddressBlock);
