// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote } from 'electron';
import path from 'path';

import Button from './Button';
import MessageBar from './MessageBar';
import Loader from './Loader';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import {
  setWalletFileName,
  setDisplay,
  setPassword,
  submitAddress,
  updateWalletLocation
} from '../reducers/walletInitialization.duck';

import styles from './Home.css';

const { DEFAULT, CREATE, IMPORT } = CREATION_CONSTANTS;

type Props = {
  currentDisplay: 'default' | 'create' | 'import',
  isLoading: boolean,
  message: Object,
  password: string,
  setDisplay: Function,
  setPassword: Function,
  setWalletFileName: Function,
  submitAddress: Function,
  updateWalletLocation: Function,
  walletFileName: string,
  walletLocation: string
};

const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

class Home extends Component<Props> {
  props: Props;

  setDisplay = display => () => this.props.setDisplay(display);

  openFile = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: dialogFilters
      },
      filePaths => {
        if (filePaths && filePaths.length) {
          this.props.updateWalletLocation(path.dirname(filePaths[0]));
          this.props.setWalletFileName(path.basename(filePaths[0]));
        }
      }
    );
  };

  saveFile = () => {
    remote.dialog.showSaveDialog({ filters: dialogFilters }, filename => {
      this.props.updateWalletLocation(path.dirname(filename));
      this.props.setWalletFileName(path.basename(filename));
    });
  };

  walletSubmissionButton = (
    label: string,
    submissionType: 'create' | 'import'
  ) => {
    const { submitAddress, isLoading } = this.props;

    return (
      <Button
        onClick={() => submitAddress(submissionType)}
        theme="primary"
        disabled={isLoading}
      >
        {label}
      </Button>
    );
  };

  renderSelectionState = () => {
    return (
      <div className={styles.defaultContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <Button buttonTheme="primary" onClick={this.setDisplay(CREATE)}>
            Create Wallet
          </Button>
        </div>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Import an existing wallet</div>
          <Button buttonTheme="secondary" onClick={this.setDisplay(IMPORT)}>
            Import Wallet
          </Button>
        </div>
      </div>
    );
  };

  renderCreateWallet = () => {
    const {
      walletFileName,
      isLoading,
      message,
      password,
      setPassword
    } = this.props;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <h3 className={styles.walletTitle}>Create a new wallet</h3>
          <div className={styles.importButtonContainer}>
            <Button buttonTheme="secondary" onClick={this.saveFile} small>
              Select File
            </Button>
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
        <MessageBar message={message} />
      </div>
    );
  };

  renderImportWallet = () => {
    const {
      isLoading,
      message,
      password,
      setPassword,
      walletFileName,
      walletLocation
    } = this.props;
    const completeWalletPath = path.join(walletLocation, walletFileName);

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <h3 className={styles.walletTitle}>
            Import your wallet from a backup
          </h3>
          <div className={styles.importButtonContainer}>
            <Button buttonTheme="secondary" onClick={this.openFile} small>
              Select Wallet File
            </Button>
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
        <MessageBar message={message} />
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
  const { walletInitialization, message } = state;

  return {
    currentDisplay: walletInitialization.get('currentDisplay'),
    isLoading: walletInitialization.get('isLoading'),
    message: message.get('message'),
    password: walletInitialization.get('password'),
    walletFileName: walletInitialization.get('walletFileName'),
    walletLocation: walletInitialization.get('walletLocation')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setWalletFileName,
      setDisplay,
      setPassword,
      submitAddress,
      updateWalletLocation
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
