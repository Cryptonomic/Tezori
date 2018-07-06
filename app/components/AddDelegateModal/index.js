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
import { createNewAccount } from '../../redux/createDelegate/thunks';

type Props = {
  selectedParentHash: string,
  createNewAccount: Function,
  open: boolean,
  onCloseClick: Function
};

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const defaultState = {
  isLoading: false,
  delegate: '',
  amount: null,
  fee: 100,
  passPhrase: ''
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  changeAmount = (_, amount) =>  this.setState({ amount });
  changeDelegate = (_, delegate) => this.setState({ delegate });
  changeFee = (_, index, fee) => this.setState({ fee });
  updatePassPhrase = (_, passPhrase) => this.setState({ passPhrase });
  setIsLoading = (isLoading) =>  this.setState({ isLoading });

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

  createAccount = async () =>  {
    const { createNewAccount, selectedParentHash, onCloseClick } = this.props;
    const { delegate, amount, fee, passPhrase } = this.state;
    this.setIsLoading(true);
    if ( await createNewAccount( delegate, amount, fee, passPhrase, selectedParentHash ) ) {
      this.setState(defaultState);
      onCloseClick();
    } else {
      this.setIsLoading(false);
    }
  };

  render() {
    const { open, onCloseClick } = this.props;
    const { isLoading, delegate, amount, fee, passPhrase } = this.state;
    const isDisabled = isLoading || !delegate || !amount || !fee || !passPhrase;

    return (
      <Dialog
        modal
        open={open}
        title="Add a Delegate"
        bodyStyle={{ padding: '5px 80px 50px 80px' }}
        titleStyle={{ padding: '50px 70px 0px' }}
      >
        <CloseIcon
          className={styles.closeIcon}
          style={{ fill: '#7190C6' }}
          onClick={onCloseClick}
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
            align={{
              offset: [70, 0],
            }}
            arrowPos={{
              left: '70%'
            }}
          >
            <Button buttonTheme="plain" className={styles.textfieldTooltip}>
              <HelpIcon
                iconName="help"
                size={ms(0)}
                color={'secondary'}
              />
            </Button>
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
            disabled={isLoading || isDisabled}
            className={styles.delegateButton}
            onClick={this.createAccount}
          >
            Delegate
          </Button>
        </div>
        {isLoading && <Loader />}
      </Dialog>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      createNewAccount
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(AddDelegateModal);
