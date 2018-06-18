// @flow
import React from 'react';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import tezosLogo from '../../resources/tezosLogo.png';

import styles from './BalanceBanner.css';

type Props = {
  balance: number,
  publicKeyHash: string,
  onRefreshClick: Function
};

export default function BalanceBanner(props: Props) {
  const { balance, publicKeyHash, onRefreshClick } = props;

  return (
    <div className={styles.totalBannerContainer}>
      <div className={styles.totalContainer}>
        <div className={styles.total}>
          {
            publicKeyHash &&
              <span>
                {balance}
                <img
                  alt="tez"
                  src={tezosLogo}
                  className={styles.tezosLogo}
                />
              </span>
          }
        </div>
        <RefreshIcon
          style={{
            fill: 'white',
            height: '40px',
            width: '40px',
            transform: 'scaleX(-1)',
            cursor: 'pointer',
          }}
          onClick={onRefreshClick}
        />
      </div>
      <div className={styles.address}>{publicKeyHash}</div>
    </div>
  );
}
