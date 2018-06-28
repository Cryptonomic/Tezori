// @flow
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField, SelectField, MenuItem } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Tooltip from '../Tooltip';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon';
import { utezToTez } from '../../utils/currancy';

import Button from '../Button';
import Loader from '../Loader';

import styles from './index.css';
import {
  changeAmount,
  changeDelegate,
  changeFee,
  createNewAccount,
  closeCreateAccountModal,
  updatePassPhrase
} from '../../reducers/createAccount.duck';

type Props = {
  changeAmount: Function,
  changeDelegate: Function,
  changeFee: Function,
  closeCreateAccountModal: Function,
  createNewAccount: Function,
  updatePassPhrase: Function,
  isLoading: boolean,
  isModalOpen: boolean,
  operation: string
};

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;



class AddDelegateModal extends Component<Props> {
  props: Props;
  state = {
    delegate: '',
    amount: null,
    fee: null,
    passPhrase: ''
  };

  changeAmount = (_, amount) => {
    this.setState({amount});
    this.props.changeAmount(amount);
  };

  changeDelegate = (_, delegate) => {
    this.setState({delegate});
    this.props.changeDelegate(delegate);
  };

  changeFee = (_, index, fee) => {
    this.setState({fee});
    this.props.changeFee(fee);
  };

  updatePassPhrase = (_, newPassPhrase) => {
    this.setState({passPhrase: newPassPhrase});
    this.props.updatePassPhrase(newPassPhrase);
  };

  renderToolTipComponent = () => {
    return (
      <div className={styles.tooltipContainer}>
        <div className={styles.tooltipTitle}>Setting a Delegate</div>
        <div className={styles.tooltipContent1}>You can always change the delegate at a later time.</div>
        <div className={styles.tooltipContent1}>There is a fee for changing the delegate.</div>
        <div className={styles.tooltipContent2}>You can only delegate to the Manager Address. The Manager Address always starts with "tz1".</div>
      </div>
    );
  };

  renderCreationBody = () => {
    const { delegate, amount, fee, passPhrase } = this.state;
    const isDisabled = !delegate || !amount || !fee || !passPhrase;
    return (
      <Fragment>
        <CloseIcon
          className={styles.closeIcon}
          style={{ fill: '#7190C6' }}
          onClick={this.props.closeCreateAccountModal}
        />
        <div className={styles.delegateContainer}>
          <TextField
            floatingLabelText="Delegate Address"
            style={{ width: '100%' }}
            onChange={this.changeDelegate}
          />
          <Tooltip
            position="bottom"
            content={this.renderToolTipComponent()}
            className={styles.textfieldTooltip}
            offset={70}
            distance={50}
            popperOptions={{
              modifiers: {
                preventOverflow: {
                  enabled: false,
                },
                flip: {
                  enabled: false,
                },
              },
            }}
            
          >
            <HelpIcon iconName="help" size={ms(0)} color="secondary" />
          </Tooltip>
        </div>
        <div className={styles.amountAndFeeContainer}>
          <div className={styles.amountSendContainer}>
            <TextField
              floatingLabelText="Amount"
              style={{ width: '100%' }}
              onChange={this.changeAmount}
            />
          </div>
          <div className={styles.feeContainer}>
            <SelectField floatingLabelText="Fee" value={fee}  onChange={this.changeFee} className={styles.feeSelectComponent}>
              <MenuItem value={100} primaryText={`Low Fee: ${ utezToTez(100)} `} />
              <MenuItem value={200} primaryText={`Medium Fee: ${ utezToTez(200)}`} />
              <MenuItem value={400} primaryText={`High Fee: ${ utezToTez(400)}`} />
              <MenuItem value={500} primaryText="Custom" />
            </SelectField>
          </div>
        </div>
        <div className={styles.amountAndFeeContainer}>
          <TextField
            floatingLabelText="Password"
            type="password"
            style={{ width: '100%' }}
            onChange={this.updatePassPhrase}
          />
        </div>
        <div className={styles.passwordButtonContainer}>
          <Button
            buttonTheme="primary"
            disabled={this.props.isLoading || isDisabled}
            className={styles.delegateButton}
            onClick={this.props.createNewAccount}
          >
            Delegate
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
        title="Add a Delegate"
        bodyStyle={{ padding: '5px 80px 50px 80px' }}
        titleStyle={{ padding: '50px 70px 0px' }}
      >
        {!this.props.operation && this.renderCreationBody()}
        {this.props.operation && this.renderOperationBody()}
      </Dialog>
    );
  }
}

function mapStateToProps({ createAccount }) {
  return {
    isLoading: createAccount.get('isLoading'),
    operation: createAccount.get('operation'),
    isModalOpen: createAccount.get('isModalOpen')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      changeAmount,
      changeDelegate,
      changeFee,
      closeCreateAccountModal,
      createNewAccount,
      updatePassPhrase
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(AddDelegateModal);
