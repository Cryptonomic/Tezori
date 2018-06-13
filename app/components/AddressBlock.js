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
  automaticAccountRefresh: Function,
  selectAccount: Function,
  selectedAccountHash: string,
  createNewAccount: Function,
  isLoading: boolean
};

export default class AddressBlock extends Component<Props> {
  props: Props;
  state = {
    isExpanded: false,
    isCreateAccountModalOpen: false,
  };

  onOpenCreateAccountModal = () => {
    this.setState({
      isCreateAccountModalOpen: true,
    });
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

  closeCreateModal = () => {
    this.setState({
      isCreateAccountModalOpen: false,
    });
  };

  onCreateAccount = (amount, delegate, spendable, delegatable, fee) => {
    this.props.createNewAccount(
      this.props.selectedAccountHash,
      amount,
      delegate,
      spendable,
      delegatable,
      fee
    );
    this.setState({ isCreateAccountModalOpen: false });
  };

  onAccountSelect = (publicKeyHash: string) => {
    this.props.selectAccount(publicKeyHash);
    this.props.automaticAccountRefresh();
  };

  renderAccountBlock = (account: Object) => {
    const balance = account.get('balance');
    const accountId = account.get('accountId');
    const { selectedAccountHash } = this.props;
    const accountBlockClasses = classNames({
      [styles.accountBlock]: true,
      [styles.addressBlockTitleContainerSelected]: accountId === selectedAccountHash,
    });

    return (
      <div
        className={accountBlockClasses}
        key={accountId}
        onClick={() => this.onAccountSelect(accountId)}
      >
        {this.renderTezosAmount(accountId, selectedAccountHash, balance)}
        <div>{accountId}</div>
      </div>
    );
  };

  renderArrowIcon = () => {
    const { isExpanded } = this.state;

    return (
      <div className={styles.arrowContainer}>
        { !isExpanded && <DropdownArrow /> }
        { isExpanded && <DropupArrow /> }
      </div>
    );
  };

  render() {
    const { accountBlock, selectedAccountHash, isLoading } = this.props;
    const publicKeyHash = accountBlock.get('publicKeyHash');
    const { isExpanded, isCreateAccountModalOpen } = this.state;
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
            onClick={() => this.onAccountSelect(publicKeyHash)}
          >
            {publicKeyHash}
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
                  height: '18px',
                  width: '18px'
                }}
                onClick={this.onOpenCreateAccountModal}
              />
            </div>
            {accountBlock.get('accounts').map(this.renderAccountBlock)}
          </div>
        }
        <CreateAccountModal
          delegate={selectedAccountHash}
          isLoading={isLoading}
          open={isCreateAccountModalOpen}
          onCreate={this.onCreateAccount}
          closeModal={this.closeCreateModal}
        />
      </div>
    );
  }
}
