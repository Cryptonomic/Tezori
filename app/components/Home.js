// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';

import CreateButton from './CreateButton';
import Loader from './Loader';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import {
  setAddress,
  setDisplay,
  setPassword,
  submitAddress,
} from '../reducers/walletInitialization.duck';

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

import styles from './Home.css';

type Props = {};

class Home extends Component<Props> {
  props: Props;

  setDisplay = (display) => () => this.props.setDisplay(display)

  renderRouteButton = (label) => {
    return (
      <CreateButton
        label={label}
        style={{
          backgroundColor: '#417DEF',
          color: 'white',
          marginTop: '20px',
        }}
        onClick={this.props.submitAddress}
      />
    );
  };

  renderSelectionState = () => {
    return (
      <div className={styles.defaultContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <CreateButton
            label="Create Wallet"
            style={{
              backgroundColor: '#417DEF',
              color: 'white',
              marginTop: '20px',
            }}
            onClick={this.setDisplay(CREATE)}
          />
        </div>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Import an existing wallet</div>
          <CreateButton
            label="Import Wallet"
            style={{
              border: '2px solid black',
              backgroundColor: 'transparent',
              marginTop: '20px',
            }}
            onClick={this.setDisplay(IMPORT)}
          />
        </div>
      </div>
    )
  };

  renderCreateWallet = () => {
    const {
      address,
      isLoading,
      password,
      setAddress,
      setPassword,
    } = this.props;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <TextField
            floatingLabelText="Name Your Wallet"
            style={{ width: '500px' }}
            value={address}
            onChange={(_, newAddress) => setAddress(newAddress)}
          />
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
            type="password"
            value={password}
            onChange={(_, newPass) => setPassword(newPass)}
          />
          {this.renderRouteButton('Create Wallet')}
        </div>
      </div>
    );
  };

  renderImportWallet = () => {
    const { isLoading, password, setPassword } = this.props;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Import your wallet from a backup</div>
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
            type="password"
            value={password}
            onChange={(_, newPass) => setPassword(newPass)}
          />
          {this.renderRouteButton('Import')}
        </div>
      </div>
    );
  };

  render() {
    const { currentDisplay } = this.props;

    switch (currentDisplay) {
      case CREATE:
        return this.renderCreateWallet();
      case IMPORT:
        return this.renderImportWallet();
      case DEFAULT:
      default:
        return this.renderSelectionState();
    }
  }
}

function mapStateToProps(state) {
  const { walletInitialization } = state;

  return {
    address: walletInitialization.get('address'),
    currentDisplay: walletInitialization.get('currentDisplay'),
    isLoading: walletInitialization.get('isLoading'),
    password: walletInitialization.get('password'),
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setAddress,
    setDisplay,
    setPassword,
    submitAddress,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
