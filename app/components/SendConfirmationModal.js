import React from 'react';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import CreateButton from './CreateButton';
import tezosLogo from '../../resources/tezosLogo.png';

import styles from './SendConfirmationModal.css';

export default function SendConfirmationModal({ amount, address }) {
  return (
    <Dialog
      open
      modal
      title="Send Confirmation"
      bodyStyle={{ padding: '50px' }}
      titleStyle={{ padding: '50px 50px 0px' }}
    >
      <CloseIcon
        className={styles.closeIcon}
        style={{ fill: '#7190C6' }}
        onClick={() => {}}
      />
      <div className={styles.confirmationText}>Do you confirm that you want to send</div>
      <div className={styles.amountSendContainer}>
        <span className={styles.amount}>
          {amount}
          <img
            src={tezosLogo}
            className={styles.tezosSymbol}
          />
        </span>
        <span> to </span>
        <span className={styles.address}>{address}</span>
      </div>
      <div className={styles.passwordButtonContainer}>
        <TextField
          floatingLabelText="Enter Password"
          style={{ width: '60%' }}
        />
        <CreateButton
          label="Confirm"
          style={{
            border: '2px solid #7B91C0',
            color: '#7B91C0',
            height: '28px',
            fontSize: '15px',
            marginTop: '15px',
          }}
        />
      </div>
    </Dialog>
  );
}
