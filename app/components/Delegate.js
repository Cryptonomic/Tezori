// @flow
import React, { Component } from 'react';
import { TextField, Dialog } from 'material-ui';

import CreateButton from './CreateButton';
import tezosLogo from '../../resources/tezosLogo.png';

import styles from './Delegate.css';

type Props = {}

export default class Delegate extends Component<Props> {
  props: Props;

  state = {
    isUpdateWarningOpen: false,
  };

  onTextFieldChange = (_, newValue) => {
    this.props.onAddressChange(newValue);
  };

  renderWarningModal = () => {
    const { address, delegateFee } = this.props;

    return (
      <Dialog
        open={this.state.isUpdateWarningOpen}
        title="Confirm Delegate Change"
        contentStyle={{ width: '600px' }}
      >
        <div>
          <div>Are you sure you want to change your delegate to:</div>
          <div className={styles.modalAddress}>{address}</div>
          <div className={styles.feeContainer}>
            <div className={styles.feeText}>Fee: </div>{delegateFee}
            <img
              src={tezosLogo}
              className={styles.tezosSymbol}
            />
          </div>
          <div className={styles.confirmationContainer}>
            <TextField
              floatingLabelText="Enter Password"
              style={{ width: '50%' }}
              type="password"
            />
            <CreateButton
              label="Confirm"
              style={{
                border: '2px solid #7B91C0',
                color: '#7B91C0',
                height: '28px',
                fontSize: '15px',
                marginTop: '15px',
              }}
              onClick={() => this.setState({ isUpdateWarningOpen: false })}
            />
          </div>
        </div>
      </Dialog>
    );
  };

  render() {
    return (
      <div className={styles.delegateContainer}>
        <TextField
          floatingLabelText="New Address"
          value={this.props.address}
          onChange={this.onTextFieldChange}
        />
        <CreateButton
          label="Update"
          style={{
            border: '2px solid #7B91C0',
            color: '#7B91C0',
            height: '28px',
            fontSize: '15px',
            marginTop: '15px',
          }}
          onClick={() => this.setState({ isUpdateWarningOpen: true })}
        />
        {this.renderWarningModal()}
      </div>
    );
  }
}
