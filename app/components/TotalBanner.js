import React from 'react';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import tezosLogo from '../../resources/tezosLogo.png';

import styles from './TotalBanner.css';

export default function TotalBanner({ total, address }) {
  return (
    <div className={styles.totalBannerContainer}>
      <div className={styles.totalContainer}>
        <div className={styles.total}>
          {total}
          <img src={tezosLogo} className={styles.tezosLogo} />
        </div>
        <RefreshIcon
          style={{
            fill: 'white',
            height: '40px',
            width: '40px',
            transform: 'scaleX(-1)',
          }}
        />
      </div>
      <div className={styles.address}>{address}</div>
    </div>
  );
}
