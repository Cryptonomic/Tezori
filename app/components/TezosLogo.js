// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import tezosLogo from '../../resources/tezosLogo.png';
import { goHomeAndClearState } from '../reducers/walletInitialization.duck';

import styles from './TezosLogo.css';

type Props = {
  goHomeAndClearState: Function
};

class TezosLogo extends Component<Props> {
  render() {
    return (
      <span onClick={this.props.goHomeAndClearState}>
        <img src={tezosLogo} className={styles.logo} />
      </span>
    );
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

export default connect(null, mapDispatchToProps)(TezosLogo);
