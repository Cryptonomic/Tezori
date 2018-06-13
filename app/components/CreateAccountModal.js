// @flow
import React, { Component } from 'react';
import {
  Dialog,
  TextField,
  SelectField,
  MenuItem,
} from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import CreateButton from './CreateButton';
import tezosLogo from '../../resources/tezosLogo.png';
import Loader from './Loader'

import styles from './CreateAccountModal.css';

type Props = {
  closeModal: Function,
  delegate: string,
  isLoading: boolean,
  onCreate: Function,
  open: boolean
};

export default class CreateAccountModal extends Component<Props> {
  props: Props;

  state = {
    delegate: this.props.delegate,
    fee: 100,
    amount: "0",
  };

  onCreateButtonPress = () => {
    const { delegate, fee, amount } = this.state;

    this.props.onCreate(amount, delegate || this.props.delegate, fee);
  };

  render() {
    return (
      <Dialog
        modal
        open={this.props.open}
        title="Add account"
        bodyStyle={{ padding: '50px' }}
        titleStyle={{ padding: '50px 50px 0px' }}
      >
        <CloseIcon
          className={styles.closeIcon}
          style={{ fill: '#7190C6' }}
          onClick={this.props.closeModal}
        />
        <div className={styles.delegateContainer}>
          <TextField
            floatingLabelText="Delegate"
            defaultValue={this.props.delegate}
            style={{ width: '100%' }}
            onChange={(_, delegate) => this.setState({ delegate })}
          />
        </div>
        <div className={styles.amountAndFeeContainer}>
          <div className={styles.amountSendContainer}>
            <TextField
              floatingLabelText="Amount"
              default="0"
              onChange={(_, amount) => this.setState({ amount })}
            />
            <img
              alt="tez"
              src={tezosLogo}
              className={styles.tezosSymbol}
            />
          </div>
          <div className={styles.feeContainer}>
            <SelectField
              value={this.state.fee}
              onChange={(_, index, fee) => this.setState({ fee })}
            >
              <MenuItem value={100} primaryText="Low Fee: 100" />
              <MenuItem value={200} primaryText="Medium Fee: 200" />
              <MenuItem value={400} primaryText="High Fee: 400" />
              <MenuItem value={500} primaryText="Custom" />
            </SelectField>
          </div>
        </div>
        <div className={styles.passwordButtonContainer}>
          <CreateButton
            label="Confirm"
            style={{
              border: '2px solid #7B91C0',
              color: '#7B91C0',
              height: '28px',
              fontSize: '15px',
              marginTop: '15px',
            }}
            onClick={this.onCreateButtonPress}
            disabled={this.props.isLoading}
          />
        </div>
        {this.props.isLoading && <Loader />}
      </Dialog>
    );
  }
}
