// @flow
import React, { Component } from 'react';
import { TextField, Dialog, SelectField, MenuItem } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from './../Button/';
import { H4 } from './../Heading/';
import TezosIcon from './../TezosIcon/';
import DelegateConfirmationModal from '../DelegateConfirmationModal/';
import Fees from '../Fees/';

import {
  validateAddress,
  delegate,
  fetchDelegationAverageFees
} from '../../reduxContent/delegate/thunks';

type Props = {
  isReady?: boolean,
  isLoading?: boolean,
  selectedAccountHash?: string,
  selectedParentHash?: string,
  address?: string,
  validateAddress?: Function,
  delegate?: Function
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
`;

const DelegateContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const DelegateInputContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-top: ${ms(1)};
`;

const UpdateButton = styled(Button)`
  flex: 0 auto;
  margin: ${ms(2)} 0 0 0;
`;

const Title = styled(H4)`
  width: 100%;
  border-bottom: 1px solid #e2e7f2;
  padding-bottom: ${ms(-4)}
`;

const DelegationTipsList = styled.ul`
  margin: 0;
  padding: 0;
  margin-bottom: ${ms(1)};
  list-style-type: none;
`

const DelegationTipsItem = styled.li`
  display: flex;
  font-weight: ${({theme: {typo}}) => typo.weights.light};
  color: ${({ theme: { colors } }) => colors.primary};
  padding: ${ms(-2)} 0;
  border-bottom: 1px solid ${({ theme: { colors } }) => colors.gray3};
`

const DelegationTipsIcon = styled(TezosIcon)`
  padding-top: ${ms(-10)};
  padding-right: ${ms(-2)};
`

const DelegationTipsContainer = styled.div`
  width: 35%;
  padding: ${ms(2)};
  background-color: ${({ theme: { colors } }) => colors.gray2};
  color: ${({ theme: { colors } }) => colors.secondary};
  font-size: ${ms(-1)};
  position: relative;
  margin-top: ${ms(1)};
`

const DelegationTitle = styled.span`
  color: ${({ theme: { colors } }) => colors.gray3};
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  font-size: ${ms(1)};
`

const SetADelegate = styled.p`
  font-weight: 300;
  font-size: ${ms(1)};
  margin-bottom: 0;
`;

const initialState = {
  open: false,
  isLoading: false,
  tempAddress: '',
  password: '',
  fee: 100,
  averageFees: {
    low: 100,
    medium: 200,
    high:400
  }
};

class Delegate extends Component<Props> {
  props: Props;
  state = initialState;

  async componentDidMount() {
    const { fetchDelegationAverageFees } = this.props;
    const averageFees = await fetchDelegationAverageFees();
    this.setState({ averageFees, fee: averageFees.low });
  }

  openConfirmation = () =>  this.setState({ open: true });
  closeConfirmation = () =>  {
    const { averageFees, fee } = this.state;
    this.setState({ ...initialState, averageFees, fee });
  };
  handlePasswordChange = (_, password) =>  this.setState({ password });
  handleTempAddressChange = (_, tempAddress) =>  this.setState({ tempAddress });
  handleFeeChange = (fee) =>  this.setState({ fee });
  setIsLoading = (isLoading) =>  this.setState({ isLoading });

  getAddress = () =>  {
    const { tempAddress } = this.state;
    const { address } = this.props;
    return tempAddress || address;
  };

  validateAddress = async () =>  {
    const { validateAddress } = this.props;
    const address = this.getAddress();
    if ( await validateAddress( address ) ) {
      this.openConfirmation();
    }
  };

  onDelegate = async () =>  {
    const { password, fee } = this.state;
    const { delegate, selectedAccountHash, selectedParentHash } = this.props;
    this.setIsLoading(true);
    if (await delegate( this.getAddress(), Math.floor(fee), password, selectedAccountHash, selectedParentHash )) {
      this.closeConfirmation();
    } else {
      this.setIsLoading(false);
    }
  };

  renderDelegationTips = (arr) => {
    return(
      <DelegationTipsList>
        {arr.map((item, index) => {
          return(
            <DelegationTipsItem key={index}>
              <DelegationTipsIcon
                iconName="arrow-right"
                size={ms(0)}
                color="gray3"
              />
              <div>{item}</div>
            </DelegationTipsItem>
          )
        })}
      </DelegationTipsList>
    )
  }

  render() {
    const { isReady } = this.props;
    const { isLoading, open, password, fee, averageFees } = this.state;
    const delegationTips = [
      'Delegating tez is not the same as sending tez. Only baking rights are transferred when setting a delegate. The delegate that you set cannot spend your tez.',
      'There is a fee for setting a delegate.',
      'Delegating is not instant. It takes 7 cycles (2-3 weeks) for your tez to start contributing to baking.',
      'Delegation rewards will depend on your arrangement with the delegate.'
    ];

    return (
      <Container>
        <Title>Delegate Settings</Title>
        <DelegateContainer>
          <DelegateInputContainer>
            <SetADelegate>Set a Delegate</SetADelegate>
            <Fees
              styles={{minWidth: 340, width: 'auto'}}
              low={ averageFees.low }
              medium={ averageFees.medium }
              high={ averageFees.high }
              fee={ fee }
              onChange={this.handleFeeChange}
            />
            <TextField
              floatingLabelText="Address"
              value={ this.getAddress() }
              style={{minWidth: 340, width: 'auto'}}
              onChange={this.handleTempAddressChange}
            />

            <UpdateButton
              disabled={ !isReady || isLoading }
              onClick={ this.validateAddress }
              buttonTheme="secondary"
              small
            >
              Update
            </UpdateButton>
          </DelegateInputContainer>
          <DelegationTipsContainer>
            <DelegationTitle>Delegation Tips</DelegationTitle>
            {this.renderDelegationTips(delegationTips)}
          </DelegationTipsContainer>
        </DelegateContainer>

        <DelegateConfirmationModal
          open={ open }
          address={ this.getAddress() }
          password={ password }
          fee={ fee }
          handleFeeChange={ this.handleFeeChange }
          handlePasswordChange={ this.handlePasswordChange }
          onDelegate={ this.onDelegate }
          onCloseClick={ this.closeConfirmation }
        />
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchDelegationAverageFees,
      validateAddress,
      delegate
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(Delegate);
