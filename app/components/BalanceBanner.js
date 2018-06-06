// @flow
import React from 'react';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import tezosLogo from '../../resources/tezosLogo.png';

import styles from './BalanceBanner.css';

type Props = {
  balance: number,
  publicKeyHash: string
};

export default function BalanceBanner(props: Props) {
  const { balance, publicKeyHash } = props;

  return (
    <div className={styles.totalBannerContainer}>
      <div className={styles.totalContainer}>
        <div className={styles.total}>
          {balance}
          <img
            alt="tez"
            src={tezosLogo}
            className={styles.tezosLogo}
          />
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
      <div className={styles.address}>{publicKeyHash}</div>
    </div>
  );
}
