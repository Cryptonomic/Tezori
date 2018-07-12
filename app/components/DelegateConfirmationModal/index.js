// @flow
import React, { Component } from 'react';
import { TextField, Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from './../Button/';
import TezosIcon from '../TezosIcon'
import { formatAmount } from '../../utils/currancy';
import { ms } from '../../styles/helpers'

import styles from './index.css';

type Props = {
  open?: boolean,
  fee?: any,
  password?: string,
  address?: string,
  onCloseClick?: Function,
  handlePasswordChange?: Function,
  onDelegate?: Function,
  isLoading?: boolean,
};

class DelegateConfirmationModal extends Component<Props> {
  props: Props;

  render() {
    const {
      open,
      fee,
      password,
      address,
      onCloseClick,
      handlePasswordChange,
      onDelegate,
      isLoading
    } = this.props;

    return (

      <Dialog
        modal
        open={open}
        title="Confirm Delegate Change"
        contentStyle={{ width: '600px' }}
      >
        <div>
          <CloseIcon
            className={styles.closeIcon}
            style={{ fill: '#7190C6' }}
            onClick={onCloseClick}
          />
          <div>Are you sure you want to change your delegate to:</div>
          <div className={styles.modalAddress}>{address}</div>
          <div className={styles.feeContainer}>
            <div className={styles.feeText}>Fee: </div>
            { formatAmount(fee) }
            <TezosIcon color='secondary' />
          </div>
          <div className={styles.confirmationContainer}>
            <TextField
              floatingLabelText="Enter Wallet Password"
              style={{ width: '50%' }}
              type="password"
              value={password}
              onChange={ handlePasswordChange }
            />

            <Button
              buttonTheme="primary"
              disabled={isLoading}
              small
              onClick={onDelegate}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default connect()(DelegateConfirmationModal);
