import React from 'react';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import AddressBlock from './AddressBlock';

import styles from './Addresses.css';

export default function Addresses() {
  return (
    <div className={styles.addressesContainer}>
      <div className={styles.addressesTitleContainer}>
        Addresses
        <AddCircle style={{ fill: '#7B91C0' }} />
      </div>
      <AddressBlock />
    </div>
  );
}

