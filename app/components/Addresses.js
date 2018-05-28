import React from 'react';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import AddressBlock from './AddressBlock';

import styles from './Addresses.css';

export default function Addresses() {
  const accountBlocks1 = [
    {tzAmount: 4.21, address: '1023rka0d9f234'},
    {tzAmount: 2.1, address: '1230rkasdofi123'},
    {tzAmount: 3.0, address: 'zs203rtkasodifg'},
  ];
  const accountBlocks2 = [
    {tzAmount: 5.95, address: '09eqrjgeqrgadf'},
    {tzAmount: 1.1, address: '1029eskadf1i23j4jlo'},
    {tzAmount: 4.25, address: '01293rjaogfij1324g'},
  ];

  return (
    <div className={styles.addressesContainer}>
      <div className={styles.addressesTitleContainer}>
        Addresses
        <AddCircle style={{ fill: '#7B91C0' }} />
      </div>
      {
        [accountBlocks1, accountBlocks2].map((accountBlocks, index) => {
          return (
            <div className={styles.addressBlockContainer}>
              <AddressBlock accountBlocks={accountBlocks} key={index} />
            </div>
          );
        })
      }
    </div>
  );
}

