// @flow
import React, {Fragment} from 'react';
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
    <header className={styles.totalBannerContainer}>
      <div className={styles.totalContainer}>
        <div className={styles.total}>
          {
            publicKeyHash &&
              <Fragment>
                <h3>
                  {balance}
                </h3>
                <img
                  alt="tez"
                  src={tezosLogo}
                  className={styles.tezosLogo}
                />
              </Fragment>
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
      <span className={styles.address}>{publicKeyHash}</span>
    </header>
  );
}
