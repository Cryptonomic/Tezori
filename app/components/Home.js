// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote } from 'electron';
import path from 'path';

import CreateButton from './CreateButton';
import Loader from './Loader';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import {
  setWalletFileName,
  setDisplay,
  setPassword,
  submitAddress,
  updateWalletLocation,
} from '../reducers/walletInitialization.duck';

import styles from './Home.css';

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

type Props = {
  setWalletFileName: Function,
  setDisplay: Function,
  setPassword: Function,
  submitAddress: Function,
  currentDisplay: 'default' | 'create' | 'import',
  isLoading: boolean,
  password: string,
  walletFileName: string,
  updateWalletLocation: Function,
  walletLocation: string
};

const dialogFilters = [ {name: 'Tezos Wallet', extensions: ['tezwallet']} ];

class Home extends Component<Props> {
  props: Props;

  setDisplay = display => () => this.props.setDisplay(display);

  openFile = () => {
    remote.dialog.showOpenDialog({
      properties: ['openFile'],
      filters: dialogFilters,
    }, filePaths => {
      if (filePaths && filePaths.length) {
        this.props.updateWalletLocation(path.dirname(filePaths[0]));
        this.props.setWalletFileName(path.basename(filePaths[0]));
      }
    });
  };

  saveFile = () => {
    remote.dialog.showSaveDialog({ filters: dialogFilters }, (filename) => {
      this.props.updateWalletLocation(path.dirname(filename));
      this.props.setWalletFileName(path.basename(filename));
    })
  };

  walletSubmissionButton = (label: string, submissionType: 'create' | 'import') => {
    const { submitAddress, isLoading } = this.props;

    return (
      <CreateButton
        label={label}
        style={{
          backgroundColor: '#417DEF',
          color: 'white',
          marginTop: '20px'
        }}
        onClick={() => submitAddress(submissionType)}
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
      walletFileName,
      isLoading,
      password,
      setPassword,
    } = this.props;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <div className={styles.importButtonContainer}>
            <CreateButton
              label="Select file"
              style={{
                border: '2px solid #7B91C0',
                color: '#7B91C0',
                height: '28px',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
              onClick={this.saveFile}
            />
            <span className={styles.walletFileName}>{walletFileName}</span>
          </div>
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
            type="password"
            value={password}
            onChange={(_, newPass) => setPassword(newPass)}
          />
          {this.walletSubmissionButton('Create Wallet', CREATE)}
        </div>
      </div>
    );
  };

  renderImportWallet = () => {
    const {
      isLoading,
      password,
      setPassword,
      walletFileName,
      walletLocation,
    } = this.props;
    const completeWalletPath = path.join(walletLocation, walletFileName);

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
            <span className={styles.walletFileName}>{completeWalletPath}</span>
          </div>
          <TextField
            floatingLabelText="Password"
            style={{ width: '500px' }}
            type="password"
            value={password}
            onChange={(_, newPass) => setPassword(newPass)}
          />
          {this.walletSubmissionButton('Import', IMPORT)}
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
    currentDisplay: walletInitialization.get('currentDisplay'),
    isLoading: walletInitialization.get('isLoading'),
    password: walletInitialization.get('password'),
    walletFileName: walletInitialization.get('walletFileName'),
    walletLocation: walletInitialization.get('walletLocation'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWalletFileName,
      setDisplay,
      setPassword,
      submitAddress,
      updateWalletLocation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
