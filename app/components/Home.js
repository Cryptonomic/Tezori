// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote } from 'electron';

import CreateButton from './CreateButton';
import Loader from './Loader';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import {
  setAddress,
  setDisplay,
  setPassword,
  submitAddress,
  setWalletFileLocation
} from '../reducers/walletInitialization.duck';

import styles from './Home.css';

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

type Props = {
  setAddress: Function,
  setDisplay: Function,
  setPassword: Function,
  submitAddress: Function,
  address: string,
  currentDisplay: 'default' | 'create' | 'import',
  isLoading: boolean,
  password: string,
  setWalletFileLocation: Function,
  walletFileLocation: string
};

class Home extends Component<Props> {
  props: Props;

  setDisplay = display => () => this.props.setDisplay(display);

  openFile = () => {
    remote.dialog.showOpenDialog({ properties: ['openFile'] }, filePaths => {
      this.props.setWalletFileLocation(filePaths[0]);
    });
  };

  renderRouteButton = label => {
    const { submitAddress, isLoading } = this.props;

    return (
      <CreateButton
        label={label}
        style={{
          backgroundColor: '#417DEF',
          color: 'white',
          marginTop: '20px'
        }}
        onClick={submitAddress}
        disabled={isLoading}
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
              marginTop: '20px'
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
              marginTop: '20px'
            }}
            onClick={this.setDisplay(IMPORT)}
          />
        </div>
      </div>
    );
  };

  renderCreateWallet = () => {
    const {
      address,
      isLoading,
      password,
      setAddress,
      setPassword
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
    const { isLoading, password, setPassword, walletFileLocation } = this.props;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>
            Import your wallet from a backup
          </div>
          <div className={styles.importButtonContainer}>
            <CreateButton
              label="Select Wallet File"
              style={{
                border: '2px solid #7B91C0',
                color: '#7B91C0',
                height: '28px',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
              onClick={this.openFile}
            />
            <span className={styles.walletFileLocation}>
              {walletFileLocation}
            </span>
          </div>
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
    walletFileLocation: walletInitialization.get('walletFileLocation')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setAddress,
      setDisplay,
      setPassword,
      submitAddress,
      setWalletFileLocation
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
