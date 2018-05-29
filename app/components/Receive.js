import React from 'react';

import qrCode from '../../resources/qrCode.png';
import CreateButton from './CreateButton';

import styles from './Receive.css';

export default function Receive({ address }) {
  return (
    <div className={styles.receiveContainer}>
      <img
        src={qrCode}
        className={styles.qrCode}
      />
      <div className={styles.addressContainer}>
        {address}
        <CreateButton
          label="Copy Address"
          style={{
            border: '2px solid #7B91C0',
            color: '#7B91C0',
            height: '28px',
            fontSize: '15px',
            marginTop: '15px',
          }}
        />
      </div>
    </div>
  );
}
