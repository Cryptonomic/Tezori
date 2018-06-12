// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import settingsIcon from '../../resources/settings.png';
import logoutIcon from '../../resources/logout.png';
import { goHomeAndClearState } from '../reducers/walletInitialization.duck';

import styles from './SettingsController.css';

type Props = {
  goHomeAndClearState: Function,
};

class SettingsController extends Component<Props> {
  props: Props;

  render() {
    return (
      <div className={styles.toolsContainer}>
        <img
          alt="Settings"
          src={settingsIcon}
          className={styles.settingsIcon}
        />
        <div className={styles.line} />
        <span onClick={this.props.goHomeAndClearState}>
          <img
            alt="Logout"
            src={logoutIcon}
            className={styles.logoutIcon}
          />
        </span>
      </div>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      goHomeAndClearState
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(SettingsController);
