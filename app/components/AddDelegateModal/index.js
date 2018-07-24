// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import Tooltip from '../Tooltip/';
import { ms } from '../../styles/helpers';
import TezosIcon from '../TezosIcon/';
import TezosNumericInput from '../TezosNumericInput'
import { wrapComponent } from '../../utils/i18n';

import Button from '../Button/';
import Loader from '../Loader/';
import Fees from '../Fees/';
import PasswordInput from '../PasswordInput';

import {
  createNewAccount,
  fetchOriginationAverageFees
} from '../../reduxContent/createDelegate/thunks';

type Props = {
  selectedParentHash: string,
  createNewAccount: () => {},
  fetchOriginationAverageFees: () => {},
  open: boolean,
  onCloseClick: () => {},
  t: () => {}
};

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const DelegateContainer = styled.div`
  width: 100%;
  position: relative;
`;

const TextfieldTooltip = styled(Button)`
  position: absolute;
  right: 10px;
  top: 44px;
`;

const TooltipContainer = styled.div`
  padding: 10px;
  color: #000;
  font-size: 14px;
  max-width: 312px;

  .customArrow .rc-tooltip-arrow {
    left: 66%;
  }
`;

const TooltipTitle = styled.div`
  color: #123262;
  font-weight: bold;
  font-size: 16px;
`;

const TooltipContent1 = styled.div`
  border-bottom:solid 1px #94a9d1;
  padding: 12px 0;
`;

const TooltipContent2 = styled.div`
  padding: 12px 0;
`;

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

  renderToolTipComponent = () => {
    return (
      <TooltipContainer>
        <TooltipTitle>Setting a Delegate</TooltipTitle>
        <TooltipContent1>
          You can always change the delegate at a later time.
        </TooltipContent1>
        <TooltipContent1>
          There is a fee for changing the delegate.
        </TooltipContent1>
        <TooltipContent2>
          {
            'You can only delegate to the Manager Address. The Manager Address always starts with "tz1".'
          }
        </TooltipContent2>
      </TooltipContainer>
    );
  };

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
    const { open, onCloseClick, t } = this.props;
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
        <DelegateContainer>
          <TextField
            floatingLabelText="Delegate Address"
            style={{ width: '100%' }}
            onChange={this.changeDelegate}
          />
          <Tooltip
            position="bottom"
            content={this.renderToolTipComponent()}
            align={{
              offset: [70, 0]
            }}
            arrowPos={{
              left: '70%'
            }}
          >
            <TextfieldTooltip
              buttonTheme="plain"
            >
              <HelpIcon
                iconName="help"
                size={ms(0)}
                color='secondary'
              />
            </TextfieldTooltip>
          </Tooltip>
        </DelegateContainer>
        <AmountFeePassContainer>
          <AmountSendContainer>
            <TezosNumericInput labelText={t('general.amount')} amount={this.state.amount}  handleAmountChange={this.changeAmount} />
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

export default compose(wrapComponent, connect(null, mapDispatchToProps))(AddDelegateModal);
