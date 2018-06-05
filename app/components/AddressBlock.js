// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import DropdownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropupArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import tezosLogo from '../../resources/tezosLogo.png';
import styles from './AddressBlock.css';

type Props = {
  accountBlock: Object,
  selectAccount: Function,
  selectedAccountHash: string
};

export default class AddressBlock extends Component<Props> {
 props: Props;
 state = {
   isExpanded: false,
 };

  onAddressBlockClick = () => {
    if (this.state.isExpanded) this.setState({ isExpanded: false});
    else this.setState({ isExpanded: true });
  };

  renderAccountBlock = (account) => {
    const { balance, accountId } = account;
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
        <div className={styles.tzAmount}>
          {balance}
          <img
            alt="tez"
            src={tezosLogo}
            className={styles.tezosSymbol}
          />
        </div>
        <div>{accountId}</div>
      </div>
    );
  };

  renderArrowIcon = () => {
    if (!this.state.isExpanded) {
      return (
        <div className={styles.arrowContainer}>
          <DropdownArrow />
        </div>
      );
    }

    return (
      <div className={styles.arrowContainer}>
        <DropupArrow />
      </div>
    );
  };

  render() {
    const { accountBlock, selectedAccountHash } = this.props;
    const { isExpanded } = this.state;
    const addressBlockTitleContainer = classNames({
      [styles.addressBlockTitleContainer]: true,
      [styles.addressBlockTitleContainerSelected]: accountBlock.publicKeyHash === selectedAccountHash,
    });

    return (
      <div className={styles.addressBlockContainer}>
        <div
          className={addressBlockTitleContainer}
          onClick={this.onAddressBlockClick}
        >
          <div
            className={styles.addressBlockTitle}
            onClick={() => this.props.selectAccount(accountBlock.publicKeyHash)}
          >
            {accountBlock.publicKeyHash}
            {this.renderArrowIcon()}
          </div>
          {isExpanded &&
            <div className={styles.tzAmount}>
              {accountBlock.balance}
              <img
                alt="tez"
                src={tezosLogo}
                className={styles.tezosSymbol}
              />
            </div>
          }
        </div>
        {this.state.isExpanded &&
          <div className={styles.accounts}>
            <div className={styles.addAccountBlock}>
              Accounts
              <AddCircle
                style={{
                  fill: '#7B91C0',
                  height: '18px',
                  width: '18px'
                }}
              />
            </div>
            {accountBlock.accounts.map(this.renderAccountBlock)}
          </div>
        }
      </div>
    );
  }
}
