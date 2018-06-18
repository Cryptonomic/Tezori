// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import BalanceBanner from './BalanceBanner';
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate';
import Loader from './Loader';
import tabConstants from '../constants/tabConstants';

import { selectAccount } from '../reducers/address.duck';

import styles from './ActionPanel.css';

const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;

type Props = {
  selectedAccount: Object, // TODO: add type for this
  isLoadingTransactions: boolean,
  selectedAccountHash: string,
  selectAccount: Function
};

class ActionPanel extends Component<Props> {
  props: Props;

  state = {
    activeTab: SEND,
    currentPage: 1
  };

  renderTab = tab => {
    const { activeTab } = this.state;
    const tabClass = classNames({
      [styles.activeTab]: activeTab === tab,
      [styles.inactiveTab]: activeTab !== tab
    });

    return (
      <div
        className={tabClass}
        key={tab}
        onClick={() => this.setState({ activeTab: tab })}
      >
        {tab}
      </div>
    );
  };

  renderSection = () => {
    const { selectedAccountHash, selectedAccount } = this.props;

    switch (this.state.activeTab) {
      case DELEGATE:
        return (
          <div className={styles.delegateContainer}>
            <Delegate />
          </div>
        );
      case RECEIVE:
        return (
          <div className={styles.receiveContainer}>
            <Receive address={selectedAccountHash} />
          </div>
        );
      case SEND:
        return (
          <div className={styles.sendContainer}>
            <Send />
          </div>
        );
      case TRANSACTIONS:
      default: {
        const transactions = selectedAccount.get('transactions');

        return (
          <div className={styles.transactionsContainer}>
            <Transactions transactions={transactions} />
            <PageNumbers
              currentPage={this.state.currentPage}
              numberOfPages={4}
              onClick={currentPage => this.setState({ currentPage })}
            />
            {this.props.isLoadingTransactions && <Loader />}
          </div>
        );
      }
    }
  };

  render() {
    const tabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];
    const { selectedAccount, selectedAccountHash, selectAccount } = this.props;

    return (
      <section className={styles.actionPanelContainer}>
        <BalanceBanner
          balance={selectedAccount.get('balance') || 0}
          publicKeyHash={selectedAccountHash || 'Inactive'}
          onRefreshClick={() => selectAccount(selectedAccountHash)}
        />
        <div className={styles.tabContainer}>{tabs.map(this.renderTab)}</div>
        {this.renderSection()}
      </section>
    );
  }
}

function mapStateToProps(state) {
  const { address } = state;

  return {
    selectedAccountHash: address.get('selectedAccountHash'),
    selectedAccount: address.get('selectedAccount'),
    isLoadingTransactions: address.get('isLoading'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectAccount,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionPanel);
