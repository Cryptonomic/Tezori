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

import Button from '../Button';
import Loader from '../Loader';
import Fees from '../Fees/';

import styles from './index.css';
import {
  createNewAccount,
  fetchOriginationAverageFees
} from '../../reduxContent/createDelegate/thunks';

type Props = {
  selectedParentHash: string,
  createNewAccount: Function,
  fetchOriginationAverageFees: Function,
  open: boolean,
  onCloseClick: Function
};

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  right: 0px;
  top: 40px;
  display: block;
`

const defaultState = {
  isLoading: false,
  delegate: '',
  amount: null,
  fee: 100,
  passPhrase: '',
  averageFees: {
    low: 100,
    medium: 200,
    high:400
  }
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps, prevState) {
    const { open, fetchOriginationAverageFees } = this.props;
    if ( open && open !== prevProps.open ) {
      const averageFees = await fetchOriginationAverageFees();
      this.setState({ averageFees, fee: averageFees.low });
    }
  }

  changeAmount = (_, amount) =>  this.setState({ amount });
  changeDelegate = (_, delegate) => this.setState({ delegate });
  changeFee = (fee) => this.setState({ fee });
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
    if ( await createNewAccount( delegate, amount, Math.floor(fee), passPhrase, selectedParentHash ) ) {
      this.setState(defaultState);
      onCloseClick();
    } else {
      this.setIsLoading(false);
    }
  };

  render() {
    const { open, onCloseClick } = this.props;
    const { isLoading, averageFees, delegate, amount, fee, passPhrase } = this.state;
    const isDisabled = isLoading || !delegate || !amount || !passPhrase;

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
                color='secondary'
              />
            </Button>
          </Tooltip>
        </div>
        <div className={styles.amountAndFeeContainer}>
          <div className={styles.amountSendContainer} style={{position:'relative'}}>
            <TextField
              floatingLabelText="Amount"
              style={{ width: '100%' }}
              onChange={this.changeAmount}
              type="number"
            />
            <TezosIconInput color='secondary' />
          </div>
          <div className={styles.feeContainer}>
            <Fees
              style={{ width: '50%' }}
              low={ averageFees.low }
              medium={ averageFees.medium }
              high={ averageFees.high }
              fee={ fee }
              onChange={this.changeFee}
            />
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
      fetchOriginationAverageFees,
      createNewAccount
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(AddDelegateModal);
