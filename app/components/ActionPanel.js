// @flow
import React, { Component } from 'react';

import TotalBanner from './TotalBanner';
import styles from './ActionPanel.css';

type Props = {}

export default class ActionPanel extends Component<Props> {
  props: Props;

  render() {
    const total = 20.42;
    const address = '12049rjksdoigj2309';

     return (
       <div className={styles.actionPanelContainer}>
         Action panel here
         <TotalBanner total={total} address={address} />
       </div>
     );
  }
}
