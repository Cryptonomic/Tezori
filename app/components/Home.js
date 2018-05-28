// @flow
import React, { Component } from 'react';
import styles from './Home.css';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.walletContainers}>
          Create a new wallet
        </div>
        <div className={styles.walletContainers}>
          Import an existing wallet
        </div>
      </div>
    );
  }
}
