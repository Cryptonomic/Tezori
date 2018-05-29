// @flow
import React, { Component } from 'react';
import classNames from 'classnames';

import TotalBanner from './TotalBanner';
import tabConstants from './tabConstants';
const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;
import PageNumbers from './PageNumbers';
import Transactions from './Transactions';
import Send from './Send';
import Receive from './Receive';
import Delegate from './Delegate';

import styles from './ActionPanel.css';

type Props = {}

export default class ActionPanel extends Component<Props> {
  props: Props;

  state = {
    activeTab: TRANSACTIONS,
    currentPage: 1,
    address: '1230rjsadoigj2093rfds',
  };

  renderTab = (tab) => {
    const { activeTab } = this.state;
    const tabClass = classNames({
      [styles.activeTab]: activeTab === tab,
      [styles.inactiveTab]: activeTab !== tab,
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
    const transactions = [
      {
        amount: 20.52,
        address: 'aovk012-34rasfga',
      },
      {
        amount: 14.23,
        address: '2094tajfgijw9egj23r',
      },
      {
        amount: 61.20,
        address: 'vnzckijgwoie412039as',
      },
      {
        amount: 89.12,
        address: '12094rjasifgj203fj',
      },
    ];
    const { address } = this.state;
    const delegateFee = 1.25;

    switch (this.state.activeTab) {
      case DELEGATE:
        return (
          <div className={styles.delegateContainer}>
            <Delegate
              address={address}
              onAddressChange={(newAddress) => this.setState({ address: newAddress })}
              delegateFee={delegateFee}
            />
          </div>
        );
      case RECEIVE:
        return (
          <div className={styles.receiveContainer}>
            <Receive address={address} />
          </div>
        );
      case SEND:
        return (
          <div className={styles.sendContainer}>
            <Send />
          </div>
        );
      case TRANSACTIONS:
      default:
        return (
          <div className={styles.transactionsContainer}>
            <Transactions transactions={transactions} />
            <PageNumbers
              currentPage={this.state.currentPage}
              numberOfPages={4}
              onClick={(currentPage) => this.setState({ currentPage })}
            />
          </div>
        )
    }
  };

  render() {
    const total = 20.42;
    const address = '12049rjksdoigj2309';
    const tabs = [TRANSACTIONS, SEND, RECEIVE, DELEGATE];

     return (
       <div className={styles.actionPanelContainer}>
         <TotalBanner total={total} address={address} />
         <div className={styles.tabContainer}>
           {tabs.map(this.renderTab)}
         </div>
         {this.renderSection()}
       </div>
     );
  }
}
