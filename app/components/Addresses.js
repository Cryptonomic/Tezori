// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import AddressBlock from './AddressBlock';
import { openAddAddressModal, selectAccount } from '../reducers/address.duck';

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
  selectedAccountHash: string
};

class Addresses extends Component<Props> {
  props: Props;

  render() {
    const accountBlocks1 = {
      publicKey: 'e09fa0ti3j40tgsdjfgj',
      privateKey: 'faoe9520qejfoifgmsdjfg',
      publicKeyHash: 'tz1293asdjo2109sd',
      balance: 502.123,
      accounts: [
        {balance: 4.21, accountId: 'TZ1023rka0d9f234'},
        {balance: 2.1, accountId: 'TZ1230rkasdofi123'},
        {balance: 3.0, accountId: 'TZ1zs203rtkasodifg'},
      ],
      operationGroups: [],
    };
    const accountBlocks2 = {
      publicKey: '1203sdoijfo2i3j4osdjfal',
      privateKey: '1209asdifok12034ksodfk',
      publicKeyHash: 'tz19w0aijsdoijewoqiwe',
      balance: 104.98,
      accounts: [
        {balance: 5.95, accountId: 'TZ109eqrjgeqrgadf'},
        {balance: 1.1, accountId: 'TZ1029eskadf1i23j4jlo'},
        {balance: 4.25, accountId: 'TZ101293rjaogfij1324g'},
      ],
      operationGroups: [],
    };

    console.log('identities', this.props.identities);
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
          [accountBlocks1, accountBlocks2].map((accountBlock) => {
            return (
              <div
                className={styles.addressBlockContainer}
                key={accountBlock.publicKeyHash}
              >
                <AddressBlock
                  accountBlock={accountBlock}
                  selectAccount={this.props.selectAccount}
                  selectedAccountHash={this.props.selectedAccountHash}
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      openAddAddressModal,
      selectAccount,
    },
    dispatch
  );
}


export default connect(mapStateToProps, mapDispatchToProps)(Addresses);
