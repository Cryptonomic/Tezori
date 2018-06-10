// @flow

import React, { Component } from 'react';
import {
  Dialog,
  TextField,
  RadioButtonGroup,
  RadioButton,
} from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import CreateButton from './CreateButton';
import tezosLogo from '../../resources/tezosLogo.png';
import Loader from './Loader'

import styles from './CreateAccountModal.css';

type Props = {};

export default class CreateAccountModal extends Component<Props> {
  props: Props;

  state = {
    delegate: this.props.delegate,
    fee: "10",
    amount: "0",
    delegatable: "delegatable_true",
    spendable: "spendable_true",
  };

  onCreateButtonPress = () => {
    const { delegate, fee, amount, delegatable, spendable } = this.state;

    this.props.onCreate(amount, delegate || this.props.delegate, spendable, delegatable, fee);
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
        <div>
          <TextField
            floatingLabelText="Delegate"
            defaultValue={this.props.delegate}
            onChange={(_, delegate) => this.setState({ delegate })}
          />
        </div>
        <div>
          <TextField
            floatingLabelText="Fee"
            defaultValue="10"
            onChange={(_, fee) => this.setState({ fee })}
          />
        </div>
        <div className={styles.delegatableAndSpendableContainer}>
          <div>
            Delegatable:
            <RadioButtonGroup
              defaultSelected="delegatable_true"
              name="delegatable"
              onChange={(_, delegatable) => this.setState({ delegatable })}
            >
              <RadioButton
                value="delegatable_true"
                label="true"
              />
              <RadioButton
                value="delegatable_false"
                label="false"
              />
            </RadioButtonGroup>
          </div>
          <div>
            Spendable:
            <RadioButtonGroup
              defaultSelected="spendable_true"
              name="spendable"
              onChange={(_, spendable) => this.setState({ spendable })}
            >
              <RadioButton
                value="spendable_true"
                label="true"
              />
              <RadioButton
                value="spendable_false"
                label="false"
              />
            </RadioButtonGroup>
          </div>
        </div>
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
