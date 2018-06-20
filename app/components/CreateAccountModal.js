// @flow
import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField, SelectField, MenuItem } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import Button from './Button';
import tezosLogo from '../../resources/tezosLogo.png';
import Loader from './Loader';

import styles from './CreateAccountModal.css';
import {
  changeAmount,
  changeDelegate,
  changeFee,
  createNewAccount,
  closeCreateAccountModal
} from '../reducers/createAccount.duck';

type Props = {
  amount: string,
  changeAmount: Function,
  changeDelegate: Function,
  changeFee: Function,
  closeCreateAccountModal: Function,
  createNewAccount: Function,
  delegate: string,
  fee: number,
  isLoading: boolean,
  isModalOpen: boolean,
  operation: string
};

class CreateAccountModal extends Component<Props> {
  props: Props;
  changeAmount = (_, amount) => {
    this.props.changeAmount(amount);
  };

  changeDelegate = (_, delegate) => {
    this.props.changeDelegate(delegate);
  };

  changeFee = (_, index, fee) => {
    this.props.changeFee(fee);
  };

  renderCreationBody = () => {
    return (
      <Fragment>
        <CloseIcon
          className={styles.closeIcon}
          style={{ fill: '#7190C6' }}
          onClick={this.props.closeCreateAccountModal}
        />
        <div className={styles.delegateContainer}>
          <TextField
            floatingLabelText="Delegate"
            style={{ width: '100%' }}
            value={this.props.delegate}
            onChange={this.changeDelegate}
          />
        </div>
        <div className={styles.amountAndFeeContainer}>
          <div className={styles.amountSendContainer}>
            <TextField
              floatingLabelText="Amount"
              default="0"
              value={this.props.amount}
              onChange={this.changeAmount}
            />
            <img alt="tez" src={tezosLogo} className={styles.tezosSymbol} />
          </div>
          <div className={styles.feeContainer}>
            <SelectField value={this.props.fee} onChange={this.changeFee}>
              <MenuItem value={100} primaryText="Low Fee: 100" />
              <MenuItem value={200} primaryText="Medium Fee: 200" />
              <MenuItem value={400} primaryText="High Fee: 400" />
              <MenuItem value={500} primaryText="Custom" />
            </SelectField>
          </div>
        </div>
        <div className={styles.passwordButtonContainer}>
          <Button
            buttonTheme="primary"
            onClick={() => {
              this.props.createNewAccount();
              this.props.closeCreateAccountModal();
            }}
            disabled={this.props.isLoading}
          >
            Confirm
          </Button>
        </div>
        {this.props.isLoading && <Loader />}
      </Fragment>
    );
  };

  renderOperationBody = () => {
    return (
      <div>
        <div>Operation successful: {this.props.operation}</div>
        <div>
          <Button
            buttonTheme="primary"
            onClick={this.props.closeCreateAccountModal}
            small
          >
            Close
          </Button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <Dialog
        modal
        open={this.props.isModalOpen}
        title="Add account"
        bodyStyle={{ padding: '50px' }}
        titleStyle={{ padding: '50px 50px 0px' }}
      >
        {!this.props.operation && this.renderCreationBody()}
        {this.props.operation && this.renderOperationBody()}
      </Dialog>
    );
  }
}

function mapStateToProps({ createAccount }) {
  return {
    delegate: createAccount.get('delegate'),
    fee: createAccount.get('fee'),
    isLoading: createAccount.get('isLoading'),
    operation: createAccount.get('operation'),
    isModalOpen: createAccount.get('isModalOpen'),
    amount: createAccount.get('amount')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeAmount,
      changeDelegate,
      changeFee,
      closeCreateAccountModal,
      createNewAccount
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountModal);
