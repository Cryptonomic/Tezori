// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote, shell } from 'electron';
import styled from 'styled-components';
import path from 'path';
import { ms } from '../styles/helpers';

import Button from './Button';
import Checkbox from './Checkbox';
import MessageBar from './MessageBar';
import TermsModal from './TermsModal';
import Loader from './Loader';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import {
  setWalletFileName,
  setDisplay,
  setPassword,
  setConfirmedPassword,
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
  confirmedPassword: string,
  setDisplay: Function,
  setPassword: Function,
  setConfirmedPassword: Function,
  setWalletFileName: Function,
  submitAddress: Function,
  updateWalletLocation: Function,
  walletFileName: string,
  walletLocation: string
};

const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const TermsAndPolicySection = styled.div`
  display: flex;
  width: 80%;
  padding: ${ms(2)} 0 ${ms(4)} 0;
  border-top-width: 1px;
  border-top-color: ${ ({ theme: { colors } }) => colors.gray3 };
  border-top-style: solid;
  justify-content: center;
  align-items: center;
`

const Strong = styled.span`
  color: ${ ({ theme: { colors } }) => colors.accent };
`

const Link = styled(Strong)`
  cursor: pointer;
`

const Description = styled.span`
  color: ${ ({ theme: { typo: { weights } } }) => weights.light };
`

const Tip = styled(Description)`
  max-width: 300px;
  padding: ${ms(2)} 0 0 0;
`

const Filling = styled.div`
  height: 70px;
`

class Home extends Component<Props> {
  props: Props;
  
  state = {
    isAgreement: false,
  }

  componentWillMount = () => {
    const result = localStorage.getItem('isTezosTermsAndPolicyAgreementAccepted')
    const isAgreement = JSON.parse(result) || false
    this.setState({ isAgreement })
  }

  openLink = () => shell.openExternal('https://github.com/Cryptonomic/Tezos-Wallet')

  setDisplay = display => () => this.props.setDisplay(display);

  updateStatusAgreement = () => {
    const { isAgreement } = this.state
    this.setState({ isAgreement: !isAgreement })
    return localStorage.setItem('isTezosTermsAndPolicyAgreementAccepted', !isAgreement)
  }

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
        buttonTheme="primary"
        disabled={isLoading}
      >
        {label}
      </Button>
    );
  };

  renderSelectionState = () => {
    return (
      <SectionContainer>
        <div className={styles.defaultContainer}>
          <div className={styles.walletContainers}>
            <div className={styles.walletTitle}>Create a new wallet</div>
            <Button buttonTheme="primary" onClick={this.setDisplay(CREATE)} disabled={!this.state.isAgreement}>
              Create Wallet
            </Button>
            <Tip>
              Want to import your funraiser account?
              <Strong> Create a wallet </Strong>
              first.
            </Tip>
          </div>
          <div className={styles.walletContainers}>
            <div className={styles.walletTitle}>Import an existing wallet</div>
            <Button buttonTheme="secondary" onClick={this.setDisplay(IMPORT)} disabled={!this.state.isAgreement}>
              Import Wallet
            </Button>
            <Filling />
          </div>
        </div>
        <TermsAndPolicySection>
          <Checkbox isChecked={this.state.isAgreement} onCheck={this.updateStatusAgreement}/>
          <Description>
            I acknowledge that I have read that I agree to
            <Link onClick={this.openLink}> Terms of Service </Link>
            and
            <Link onClick={this.openLink}> Privacy Policy</Link>
          </Description>
        </TermsAndPolicySection>
        <TermsModal 
          isOpen={!this.state.isAgreement}
          agreeTermsAndPolicy={this.updateStatusAgreement}
        />
      </SectionContainer>
    );
  };

  renderCreateWallet = () => {
    const {
      walletFileName,
      isLoading,
      message,
      password,
      confirmedPassword,
      setPassword,
      setConfirmedPassword
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
          <TextField
            floatingLabelText="Confirm Password"
            style={{ width: '500px', marginBottom: ms(5) }}
            type="password"
            value={confirmedPassword}
            onChange={(_, newPass) => setConfirmedPassword(newPass)}
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
            style={{ width: '500px', marginBottom: ms(5) }}
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
    confirmedPassword: walletInitialization.get('confirmedPassword'),
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
      setConfirmedPassword,
      submitAddress,
      updateWalletLocation
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
