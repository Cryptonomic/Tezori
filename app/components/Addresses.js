// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import AddressBlock from './AddressBlock';
import {
  openAddAddressModal,
  selectAccount,
  createNewAccount,
} from '../reducers/address.duck';

import styles from './Addresses.css';

type OperationGroup = {
  hash: string,
  branch: string,
  kind: string,
  block: string,
  level: number,
  slots: number,
  signature: string,
  proposals: string,
  period: number,
  source: string,
  proposal: string,
  ballot: string,
  chain: string,
  counter: number,
  fee: number,
  blockId: string
};

type Account = {
  accountId: string,
  blockId: string,
  manager: string,
  spendable: boolean,
  delegateSetable: boolean,
  delegateValue: string,
  counter: number,
  script: string,
  balance: number
};

type Identity = {
  privateKey: string,
  publicKey: string,
  publicKeyHash: string,
  balance: number,
  operationGroups: List<OperationGroup>,
  accounts: List<Account>
};

type Props = {
  openAddAddressModal: Function,
  identities: List<Identity>,
  selectAccount: Function,
  selectedAccountHash: string,
  createNewAccount: Function,
  isLoading: boolean
};

class Addresses extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.addressesContainer}>
        <div className={styles.addressesTitleContainer}>
          Addresses
          <AddCircle
            style={{ fill: '#7B91C0' }}
            className={styles.addAddressIcon}
            onClick={this.props.openAddAddressModal}
          />
        </div>
        {
          this.props.identities.map((accountBlock) => {
            return (
              <div
                className={styles.addressBlockContainer}
                key={accountBlock.get('publicKeyHash')}
              >
                <AddressBlock
                  accountBlock={accountBlock}
                  selectAccount={this.props.selectAccount}
                  selectedAccountHash={this.props.selectedAccountHash}
                  createNewAccount={this.props.createNewAccount}
                  isLoading={this.props.isLoading}
                />
              </div>
            );
          })
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { address } = state;

  return {
    identities: address.get('identities'),
    selectedAccountHash: address.get('selectedAccountHash'),
    isLoading: address.get('isLoading'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      openAddAddressModal,
      selectAccount,
      createNewAccount,
    },
    dispatch
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(Addresses);
