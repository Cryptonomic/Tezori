// @flow
import React, { Component } from 'react';
import classNames from 'classnames';

import TotalBanner from './TotalBanner';
import tabConstants from './tabConstants';
const { TRANSACTIONS, SEND, RECEIVE, DELEGATE } = tabConstants;

import styles from './ActionPanel.css';

type Props = {}

export default class ActionPanel extends Component<Props> {
  props: Props;

  state = {
    activeTab: TRANSACTIONS,
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
       </div>
     );
  }
}
