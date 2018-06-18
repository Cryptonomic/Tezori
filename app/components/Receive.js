// @flow
import React, { Component } from 'react';
import { clipboard } from 'electron';
import classNames from 'classnames';
import QRCode from 'qrcode';

import CreateButton from './CreateButton';

import styles from './Receive.css';

type Props = {
  address: string
};

export default class Receive extends Component<Props> {
  props: Props;

  state = {
    showCopyConfirmation: false,
  };

  componentDidMount() {
    try {
      QRCode.toCanvas(this.canvasRef.current, this.props.address, {width: 300}, (err) => {
        if (err) console.error(err);
      })
    } catch (e) {
      console.error(e);
    }
  }

  canvasRef = React.createRef();
  copyToClipboard = () => {
    try {
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
    } catch (e) {
      console.error(e);
    }
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

    return (
      <div className={styles.receiveContainer}>
        <canvas
          ref={this.canvasRef}
          className={styles.qrCode}
        />
        <div className={styles.addressContainer}>
          {address}
          {this.renderCopyConfirmation()}
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
