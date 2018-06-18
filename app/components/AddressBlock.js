// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import DropdownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropupArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import CreateAccountModal from './CreateAccountModal';
import tezosLogo from '../../resources/tezosLogo.png';
import styles from './AddressBlock.css';

type Props = {
  accountBlock: Object, // TODO: type this
  openCreateAccountModal: Function,
  selectAccount: Function,
  selectedAccountHash: string
};

export default class AddressBlock extends Component<Props> {
  props: Props;
  state = {
    isExpanded: false,
  };

  renderTezosAmount = (accountId: string, selectedAccountHash: string, balance: number) => {
    const tzAmountClasses = classNames({
      [styles.tzAmount]: true,
      [styles.tzAmountSelected]: accountId === selectedAccountHash,
    });
    const tezosSymbolClasses = classNames({
      [styles.tezosSymbol]: accountId !== selectedAccountHash,
      [styles.tezosSymbolGray]: accountId === selectedAccountHash,
    });

    return (
      <div className={tzAmountClasses}>
        {balance}
        <img
          alt="tez"
          src={tezosLogo}
          className={tezosSymbolClasses}
        />
      </div>
    );
  };

  onAddressBlockClick = () => {
    if (this.state.isExpanded) this.setState({ isExpanded: false});
    else this.setState({ isExpanded: true });
  };

  renderAccountBlock = (account) => {
    const balance = account.get('balance');
    const accountId = account.get('accountId');
    const { selectAccount, selectedAccountHash } = this.props;
    const accountBlockClasses = classNames({
      [styles.accountBlock]: true,
      [styles.addressBlockTitleContainerSelected]: accountId === selectedAccountHash,
    });

    return (
      <div
        className={accountBlockClasses}
        key={accountId}
        onClick={() => selectAccount(accountId)}
      >
        {this.renderTezosAmount(accountId, selectedAccountHash, balance)}
        <div className={styles.accountBlockAddress}>{accountId}</div>
      </div>
    );
  };

  renderArrowIcon = () => {
    const { isExpanded } = this.state;

    return (
      <div className={styles.arrowContainer}>
        { !isExpanded && <DropdownArrow /> }
        { isExpanded && <DropupArrow style={{fill: '#FFFFFF'}} /> }
      </div>
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
      <div className={styles.addressBlockContainer}>
        <div
          className={addressBlockTitleContainer}
          onClick={this.onAddressBlockClick}
        >
          <div
            className={styles.addressBlockTitle}
            onClick={() => this.props.selectAccount(publicKeyHash)}
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
            {accountBlock.get('accounts').map(this.renderAccountBlock)}
          </div>
        }
        <CreateAccountModal />
      </div>
    );
  }
}
