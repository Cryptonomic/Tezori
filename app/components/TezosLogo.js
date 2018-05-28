import React from 'react';
import tezosLogo from '../../resources/tezosLogo.png';
import { Link } from 'react-router-dom';

import styles from './TezosLogo.css';

export default function TezosLogo () {
  return (
    <Link to="/">
      <img src={tezosLogo} className={styles.logo} />
    </Link>
  );
};
