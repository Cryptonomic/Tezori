// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import settingsIcon from '../../resources/settings.png';
import logoutIcon from '../../resources/logout.png';

import styles from './Settings.css';

type Props = {}

export default class Settings extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.toolsContainer}>
        <img src={settingsIcon} className={styles.settingsIcon} />
        <div className={styles.line}></div>
        <Link to="/">
          <img src={logoutIcon} className={styles.logoutIcon} />
        </Link>
      </div>
    )
  }
}
