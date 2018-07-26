// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import TezosIcon from '../TezosIcon/';

import Button from '../Button/';
import Loader from '../Loader/';
import Fees from '../Fees/';
import PasswordInput from '../PasswordInput';
import InputAddress from '../InputAddress/';

import {
  createNewAccount,
  fetchOriginationAverageFees
} from '../../reduxContent/createDelegate/thunks';

type Props = {
  selectedParentHash: string,
  createNewAccount: () => {},
  fetchOriginationAverageFees: () => {},
  open: boolean,
  onCloseClick: () => {}
};

const AmountFeePassContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;

const AmountSendContainer = styled.div`
  width: 45%;
  position: relative;
`;

const FeeContainer = styled.div`
  width: 45%;
  display: flex;
`;

const TezosIconInput = styled(TezosIcon)`
  position: absolute;
  right: 20px;
  top: 40px;
  display: block;
`;

const PasswordButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 42px;
`;

const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
`;

const defaultState = {
  isLoading: false,
  delegate: '',
  amount: null,
  fee: 100,
  passPhrase: '',
  isShowedPwd: false,
  averageFees: {
    low: 100,
    medium: 200,
    high: 400
  }
};

class AddDelegateModal extends Component<Props> {
  props: Props;
  state = defaultState;

  async componentDidUpdate(prevProps) {
    const { open, fetchOriginationAverageFees } = this.props;
    if (open && open !== prevProps.open) {
      const averageFees = await fetchOriginationAverageFees();
      this.setState({ averageFees, fee: averageFees.low });// eslint-disable-line react/no-did-update-set-state
    }
  }

  changeAmount = (_, amount) => this.setState({ amount });
  changeDelegate = (_, delegate) => this.setState({ delegate });
  changeFee = (fee) => this.setState({ fee });
  updatePassPhrase = (passPhrase) => this.setState({ passPhrase });
  setIsLoading = (isLoading) =>  this.setState({ isLoading });

  createAccount = async () => {
    const { createNewAccount, selectedParentHash, onCloseClick } = this.props;
    const { delegate, amount, fee, passPhrase } = this.state;
    this.setIsLoading(true);
    if (
      await createNewAccount(
        delegate,
        amount,
        Math.floor(fee),
        passPhrase,
        selectedParentHash
      )
    ) {
      this.setState(defaultState);
      onCloseClick();
    } else {
      this.setIsLoading(false);
    }
  };

  render() {
    const { open, onCloseClick } = this.props;
    const { isLoading, averageFees, delegate, amount, fee, passPhrase, isShowedPwd } = this.state;
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
          style={{
            fill: '#7190C6',
            cursor: 'pointer',
            height: '20px',
            width: '20px',
            position: 'absolute',
            top: '10px',
            right: '15px',
          }}
          onClick={onCloseClick}
        />
        <InputAddress tooltip labelText="Delegate Address" changeDelegate={this.changeDelegate} />
        <AmountFeePassContainer>
          <AmountSendContainer>
            <TextField
              floatingLabelText="Amount"
              style={{ width: '100%' }}
              onChange={this.changeAmount}
              type="number"
            />
            <TezosIconInput color='secondary' iconName="tezos" />
          </AmountSendContainer>
          <FeeContainer>
            <Fees
              style={{ width: '50%' }}
              low={averageFees.low}
              medium={averageFees.medium}
              high={averageFees.high}
              fee={fee}
              onChange={this.changeFee}
            />
          </FeeContainer>
        </AmountFeePassContainer>

        <PasswordInput
          label='Wallet Password'
          isShowed={isShowedPwd}
          changFunc={this.updatePassPhrase}
          onShow={()=> this.setState({isShowedPwd: !isShowedPwd})}
        />

        <PasswordButtonContainer>
          <DelegateButton
            buttonTheme="primary"
            disabled={isLoading || isDisabled}
            onClick={this.createAccount}
          >
            Delegate
          </DelegateButton>
        </PasswordButtonContainer>
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
