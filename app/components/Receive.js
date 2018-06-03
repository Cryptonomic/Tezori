// @flow
import React, { Component } from 'react';
import { clipboard } from 'electron';
import classNames from 'classnames';

import qrCode from '../../resources/qrCode.png';
import CreateButton from './CreateButton';

import styles from './Receive.css';

type Props = {};

export default class Receive extends Component<Props> {
  props: Props;

  state = {
    showCopyConfirmation: false,
  };

  copyToClipboard = () => {
    clipboard.writeText(this.props.address);
    this.setState({
      showCopyConfirmation: true,
    }, () => {
      setTimeout(() => {
        this.setState({
          showCopyConfirmation: false,
        });
      }, 2500);
    });
  };

  renderCopyConfirmation = () => {
    const copyConfirmationClasses = classNames({
      [styles.copyConfirmation]: true,
      [styles.showCopyConfirmation]: this.state.showCopyConfirmation,
    });

    return (
      <div className={copyConfirmationClasses}>
        Copied!
      </div>
    );
  };

  render() {
    const { address } = this.props;
    const { showCopyConfirmation } = this.state;

    return (
      <div className={styles.receiveContainer}>
        <img
          src={qrCode}
          className={styles.qrCode}
        />
        <div className={styles.addressContainer}>
          {address}
          { this.renderCopyConfirmation()}
          <CreateButton
            label="Copy Address"
            style={{
              border: '2px solid #7B91C0',
              color: '#7B91C0',
              height: '28px',
              fontSize: '15px',
              marginTop: '15px',
            }}
            onClick={this.copyToClipboard}
          />
        </div>
      </div>
    );
  }
}
