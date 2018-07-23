import React from 'react';

import styles from './Loader.css';

type Props = {
  height?: string
};

export default function Loader({ height = '80px' }: Props) {
  return (
    <div className={styles.showbox}>
      <div className={styles.loader} style={{ height }}>
        <svg className={styles.circular} viewBox="25 25 50 50">
          <circle
            className={styles.path}
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
        </svg>
      </div>
    </div>
  );
}
