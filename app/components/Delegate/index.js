// @flow
import React, { Component } from 'react';
import { TextField, Dialog } from 'material-ui';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from './../Button';
import DelegateConfirmationModal from '../DelegateConfirmationModal/';

import {
  validateAddress,
  delegate,
} from '../../redux/delegate/thunks';

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

const UpdateButton = styled(Button)`
  margin: ${ms(2)} 0 0 0;
`;
const defaultState = {
  open: false,
  isLoading: false,
  tempAddress: '',
  password: '',
  fee: 100
};

class Delegate extends Component<Props> {
  props: Props;
  state = defaultState;

  openConfirmation = () =>  this.setState({ open: true });
  closeConfirmation = () =>  this.setState(defaultState);
  handlePasswordChange = (_, password) =>  this.setState({ password });
  handleTempAddressChange = (_, tempAddress) =>  this.setState({ tempAddress });
  handleFeeChange = (_, index, fee) =>  this.setState({ fee });
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
    if (await delegate( this.getAddress(), fee, password, selectedAccountHash, selectedParentHash )) {
      this.closeConfirmation();
    } else {
      this.setIsLoading(false);
    }
  };

  render() {
    const { isReady } = this.props;
    const { isLoading, open, password, fee } = this.state;

    return (
      <Container>
        <TextField
          floatingLabelText="Delegate Address"
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
      validateAddress,
      delegate
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(Delegate);
