// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote } from 'electron';
import path from 'path';

import CreateButton from './CreateButton';
import MessageBar from './MessageBar';
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

class Home extends Component<Props> {
  props: Props;

  setDisplay = display => () => this.props.setDisplay(display);

  selectDirectory = () => {
    remote.dialog.showOpenDialog({ properties: ['openDirectory'] } , filePaths => {
      if (filePaths && filePaths.length) {
        this.props.updateWalletLocation(filePaths[0]);
      }
    });
  };

  openFile = () => {
    remote.dialog.showOpenDialog({ properties: ['openFile'] }, filePaths => {
      if (filePaths && filePaths.length) {
        this.props.updateWalletLocation(path.dirname(filePaths[0]));
        this.props.setWalletFileName(path.basename(filePaths[0]));
      }
    });
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
      message,
      password,
      setWalletFileName,
      setPassword,
      walletLocation,
    } = this.props;
    const completeWalletPath = path.join(walletLocation, walletFileName);

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <div className={styles.importButtonContainer}>
            <CreateButton
              label="Select a location"
              style={{
                border: '2px solid #7B91C0',
                color: '#7B91C0',
                height: '28px',
                fontSize: '15px',
                backgroundColor: 'transparent'
              }}
              onClick={this.selectDirectory}
            />
            <span className={styles.walletFileName}>{completeWalletPath.length > 1 && completeWalletPath}</span>
          </div>
          <TextField
            floatingLabelText="Name Your Wallet"
            style={{ width: '500px' }}
            value={walletFileName}
            onChange={(_, newFileName) => setWalletFileName(newFileName)}
          />
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
      walletLocation,
    } = this.props;
    const completeWalletPath = path.join(walletLocation, walletFileName);

    console.log('message', message);
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
