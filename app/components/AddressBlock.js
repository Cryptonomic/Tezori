// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import styled from 'styled-components'
import {darken} from 'polished';
import {ms} from '../styles/helpers'

import DropdownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropupArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import CreateAccountModal from './CreateAccountModal';
import tezosLogo from '../../resources/tezosLogo.png';
import styles from './AddressBlock.css';

//
// .accounts {
//   background-color: #f9fafc;
// }
//
// .addressBlockTitle {
//   display: grid;
//   grid-template-columns: auto auto;
//   grid-column-gap: 1rem;
//   font-weight: 300;
//   font-size: 1rem;
//   align-items: center;
// }
//
// .addressBlockTitle span {
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
//
// .addressBlockTitleContainerSelected {
//   background-color: #417DEF;
//   color: #E3E7F1;
// }
//
// .addressBlockTitleContainer {
//   cursor: pointer;
//   padding: 15px 20px;
// }
//
// .arrowContainer {
//   cursor: pointer;
// }
//
// .tzAmount {
//   font-weight: 500;
//   font-size: 14px;
//   display: flex;
//   color: black;
// }
//

//
// .accountBlockAddress {
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
//   font-weight: 300;
// }
//
// .tzAmountSelected {
//   color: #E3E7F1;
// }
//
// .addAccountBlock {
//   border-bottom: 1px solid #edf0f7;
//   padding: 15px;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   cursor: pointer;
//   color: #7B91C0;
//   font-size: 16px;
//   font-weight: 500;
//   min-height: 30px;
// }
//

const Container = styled.div`
  overflow: hidden;
`

const Tezos = styled.span`
  display: flex;
  align-items: center;
  font-size: ${ms(-1)};
  font-weight: 500;
  color: ${({isActive, theme: {colors}}) => isActive ? colors.white : colors.primary}
`

const TezosSymbol = styled.img`
  height: ${ms(0)};
  filter: ${({isActive}) => isActive ? 'brightness(0.5%) invert(100%)' : 'brightness(0%)'}
`

const AccountBlock = styled.div`
  border-bottom: 1px solid ${({theme: {colors}}) => darken(0.1, colors.white)};
  padding: ${ms(0)} ${ms(1)};
  cursor: pointer;
  background: ${({isActive, theme: {colors}}) => isActive ? colors.accent : colors.white};
  color: ${({isActive, theme: {colors}}) => isActive ? colors.white : colors.secondary};
`

const ArrowContainer = styled.div`
  cursor: pointer;
`

type Props = {
  accountBlock: Object, // TODO: type this
  openCreateAccountModal: Function,
  selectAccount: Function,
  selectedAccountHash: string
};

type State = {
  isExpanded: boolean
}

export default class AddressBlock extends Component<Props, State> {
  props: Props;
  state = {
    isExpanded: false,
  };

  renderTezosAmount = (accountId: string, selectedAccountHash: string, balance: number) => {
    const isActive = accountId === selectedAccountHash

    return (
      <Tezos isActive={isActive}>
        {balance}
        <TezosSymbol alt="tez" src={tezosLogo} isActive={isActive} />
      </Tezos>
    );
  };

  onAddressBlockClick = () => {
    if (this.state.isExpanded) this.setState({ isExpanded: false});
    else this.setState({ isExpanded: true });
  };

  selectAccount = (accountHash: string, parentHash: string) => {
    this.props.selectAccount(accountHash, parentHash);
  };

  renderAccountBlock = (publicKeyHash: string) => account => {
    const balance = account.get('balance');
    const accountId = account.get('accountId');
    const { selectedAccountHash } = this.props;

    return (
      <AccountBlock
        isActive={accountId === selectedAccountHash}
        key={accountId}
        onClick={() => this.selectAccount(accountId, publicKeyHash)}
      >
        {this.renderTezosAmount(accountId, selectedAccountHash, balance)}
        {accountId}
      </AccountBlock>
    );
  };

  renderArrowIcon = () => {
    const { isExpanded } = this.state;

    return (
      <ArrowContainer>
        { !isExpanded && <DropdownArrow /> }
        { isExpanded && <DropupArrow style={{fill: '#FFFFFF'}} /> }
      </ArrowContainer>
    );
  };

  render() {
    const { accountBlock, selectedAccountHash } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');
    const { isExpanded } = this.state;
    const addressBlockTitleContainer = classNames({
      [styles.addressBlockTitleContainer]: true,
      [styles.addressBlockTitleContainerSelected]: publicKeyHash === selectedAccountHash,
    });

    return (
      <Container>
        <div
          className={addressBlockTitleContainer}
          onClick={this.onAddressBlockClick}
        >
          <div
            className={styles.addressBlockTitle}
            onClick={() => this.props.selectAccount(publicKeyHash, publicKeyHash)}
          >
            <span>{publicKeyHash}</span>
            {this.renderArrowIcon()}
          </div>
          {
            isExpanded &&
              this.renderTezosAmount(publicKeyHash, selectedAccountHash, accountBlock.get('balance'))
          }
        </div>

        {isExpanded &&
          <div className={styles.accounts}>
            <div className={styles.addAccountBlock}>
              Accounts
              <AddCircle
                style={{
                  fill: '#7B91C0',
                  height: '16px',
                  width: '20px'
                }}
                onClick={this.props.openCreateAccountModal}
              />
            </div>
            {accountBlock.get('accounts').map(this.renderAccountBlock(publicKeyHash))}
          </div>
        }
        <CreateAccountModal />
      </Container>
    );
  }
}
