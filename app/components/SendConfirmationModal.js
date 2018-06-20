// @flow
import React from 'react';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import styled from 'styled-components'
import { ms }  from '../styles/helpers'

import { H5 } from './Heading'
import tezosLogo from '../../resources/tezosLogo.png';
import Loader from './Loader'
import Button from './Button'

import styles from './SendConfirmationModal.css';

const AmountContainer = styled.div`
  marginBottom: ${ms(4)}
`

const Amount = styled.div`
  border-bottom: 1px solid #7B91C0;
  color: ${ ({ theme: { colors } }) => colors.secondary };
  margin-left: 15px;
  font-size: 20px;
`

type Props = {
  amount?: string,
  address?: string,
  open?: boolean,
  isLoading?: boolean,
  updatePassword?: Function,
  password?: string,
  onCloseClick?: Function,
  sendConfirmation?: Function
}

const SendConfirmationModal = (props) => {
  const {
    amount,
    address,
    open,
    isLoading,
    updatePassword,
    password,
    onCloseClick,
    sendConfirmation,
  } = props

  const onClose = () => {
    updatePassword('');
    onCloseClick();
  }

  return (
    <Dialog
      modal
      open={open}
      title="Send Confirmation"
      bodyStyle={{ padding: '50px' }}
      titleStyle={{ padding: '50px 50px 0px' }}
    >
      <CloseIcon
        className={styles.closeIcon}
        style={{ fill: '#7190C6' }}
        onClick={onClose}
      />
      <H5 className={styles.confirmationText}>Do you confirm that you want to send</H5>
      <AmountContainer>
        <span className={styles.amount}>
          {amount}
          <img
            src={tezosLogo}
            className={styles.tezosSymbol}
          />
        </span>
        <span> to </span>
        <span className={styles.address}>{address}</span>
      </AmountContainer>
      <div className={styles.passwordButtonContainer}>
        <TextField
          floatingLabelText="Enter Password"
          style={{ width: '60%' }}
          type="password"
          value={password}
          onChange={(_, newPassword) => updatePassword(newPassword)}
        />
        <Button
          theme='secondary'
          onClick={sendConfirmation}
          disabled={isLoading}>Confirm</Button>
      </div>
      {isLoading && <Loader />}
    </Dialog>
  );
}

export default SendConfirmationModal
