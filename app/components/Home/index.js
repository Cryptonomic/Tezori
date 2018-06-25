// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote } from 'electron';
import path from 'path';
import PasswordValidator from 'password-validator';
import { ms } from '../../styles/helpers'

import Button from '../Button';
import MessageBar from '../MessageBar';
import Loader from '../Loader';
import CREATION_CONSTANTS from '../../constants/CreationTypes';
import {
  setWalletFileName,
  setDisplay,
  setPassword,
  setConfirmedPassword,
  submitAddress,
  updateWalletLocation
} from '../../reducers/walletInitialization.duck';

import styles from './index.css';

const { CREATE, IMPORT, CHOOSEDIRECTORY } = CREATION_CONSTANTS;

type Props = {
  currentDisplay: 'chooseDirectory' | 'create' | 'import' | 'default',
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

interface IState {
  isInputPasswod: boolean,
  isPasswordValidation: boolean,
  isInputConfirmPassword: boolean,
  isPasswordMatched: boolean,
  password: string
}

const inputStyles = {
  underlineFocusStyle: {
    borderColor: '#2c7df7',
  },
  underlineStyle: {
    borderColor: '#d0d2d8',
  },
  errorUnderlineStyle: {
    borderColor: '#ea776c',
  },
  floatingLabelStyle: {
    color: 'rgba(0, 0, 0, 0.38)',
  },
  floatingLabelFocusStyle: {
    color: '#5571a7',
  },
};

const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

class Home extends Component<Props, IState> {
  props: Props;
  state: IState;

  constructor(props: IProps) {
		super(props);

		this.state = {
			isInputPasswod: false,
      isPasswordValidation: false,
      isInputConfirmPassword: false,
      isPasswordMatched: false,
      password: ''
		};
	}

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

  openDirectory = () => {
    remote.dialog.showOpenDialog(
      {
        properties: ['openDirectory']
      },
      filePaths => {
        if (filePaths && filePaths.length) {
          this.props.updateWalletLocation(filePaths[0]);
        }
      }
    );
  };

  changeWalletFileName = (val) => {
    let walletName = val.replace(/ /gi, '_');
    if (walletName) {
      walletName += '.tezwallet';
    } else {
      walletName = '';
    }    
    this.props.setWalletFileName(walletName);
  }
  changePassword = (val) => {
    if (val) {
      if (!this.state.isInputPasswod) this.setState({ isInputPasswod: true });
      const schema = new PasswordValidator();
      schema
      .is().min(8)
      .is().max(100)
      .has().uppercase()
      .has().lowercase()
      .has().digits()
      .has().symbols()
      .has().not().spaces();
      const isValid = schema.validate(val);
      if (this.state.isPasswordValidation !== isValid) {
        this.setState({ isPasswordValidation: isValid });
      }      
    } else {
      this.setState({ isPasswordValidation: false });
    }

    this.setState({password: val});
    this.props.setPassword(val);
  }

  confirmPassword = (val) => {
    const { password, setConfirmedPassword } = this.props;
    if (!this.state.isInputConfirmPassword) {
      this.setState({ isInputConfirmPassword: true });
    }

    if (this.state.isInputConfirmPassword && password && password === val) {
      this.setState({ isPasswordMatched: true });
    } else {
      this.setState({ isPasswordMatched: false });
    }
    setConfirmedPassword(val);
  }

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

  inputTextField = (
    label: string,
    type: string,    
    changFunc: Function,
    isErrorUnderline: boolean = false
  ) => {
    return (
      <TextField
        floatingLabelText={label}
        className={styles.inputContainer}
        type={type}
        floatingLabelStyle={inputStyles.floatingLabelStyle}
        floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
        underlineStyle={isErrorUnderline? inputStyles.errorUnderlineStyle : inputStyles.underlineStyle}
        underlineFocusStyle={isErrorUnderline? inputStyles.errorUnderlineStyle : inputStyles.underlineFocusStyle}            
        onChange={(_, newVal) => changFunc(newVal)}
      />
    );
  };

  renderSelectionState = () => {
    return (
      <div className={styles.defaultContainer}>
        <div className={styles.walletContainers}>
          <div className={styles.walletTitle}>Create a new wallet</div>
          <Button buttonTheme="primary" onClick={this.setDisplay(CHOOSEDIRECTORY)}>
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

  renderEncryptWallet = () => {
    const {
      isLoading,
      message,
      submitAddress
    } = this.props;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <h3 className={styles.walletTitle}>Encrypt your wallet file</h3>
          {this.inputTextField('Create Password', 'password', this.changePassword, this.state.isInputPasswod && !this.state.isPasswordValidation)}
          {this.state.isInputPasswod && !this.state.password && <div className={styles.errorValidation}>Password is required.</div>}
          {this.state.password && !this.state.isPasswordValidation && <div className={styles.errorValidation}>Password must have 3 of the following: 1 lower case character, 1 upper case character, 1 number, and 1 special character.</div>}
          {this.state.password && this.state.isPasswordValidation && <div className={styles.validation}>Password is validated.</div>}
          
          {this.inputTextField('Confirm Password', 'password', this.confirmPassword, this.state.isInputConfirmPassword && !this.state.isPasswordMatched)}
          {this.state.isInputConfirmPassword &&  !this.state.isPasswordMatched && <div className={styles.errorValidation}>Passwords don&apos;t match.</div>}
          {this.state.isInputConfirmPassword &&  this.state.isPasswordMatched && <div className={styles.validation}>Passwords matched.</div>}
          <div className={styles.walletDescription}>
            You&apos;ll need this password to open your wallet file, confirm transactions, or any time you will need to reimport this wallet file from another computer.
          </div>
          <div className={styles.actionButtonContainer}>
            <Button
              className={styles.actionButton}
              buttonTheme="primary"
              onClick={() => submitAddress(CREATE)}
              disabled={isLoading || !this.state.isPasswordValidation || !this.state.isPasswordMatched}
            >
              Create
            </Button>
          </div>
        </div>
        <MessageBar message={message} />
      </div>
    );
  };

  renderChooseDirectory = () => {
    const {
      walletLocation,
      walletFileName,
      message
    } = this.props;
    const completeWalletPath = path.join(walletLocation, walletFileName);

    return (
      <div className={styles.createContainer}>
        <div className={styles.walletContainers}>
          <h3 className={styles.walletTitle}>Create a new wallet file</h3>
          {this.inputTextField('Name Your Wallet File', 'text', this.changeWalletFileName)}
          <div className={styles.importButtonContainer}>
            <Button buttonTheme="secondary" onClick={this.openDirectory} small>
              Choose Directory
            </Button>
            <span className={styles.walletFileName}>{completeWalletPath}</span>
          </div>
          <div className={styles.walletDescription}>
            We&apos;ll be storing all of your wallet information in file on your computer. Don’t worry the file will be encrypted with a password you will set.
          </div>
          <div className={styles.actionButtonContainer}>
            <Button
              className={styles.actionButton}
              buttonTheme="primary"
              onClick={this.setDisplay(CREATE)}
              disabled={!walletFileName || !walletLocation}
            >
              NEXT
            </Button>
          </div>
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
        return this.renderEncryptWallet();
      case IMPORT:
        return this.renderImportWallet();
      case CHOOSEDIRECTORY:
        return this.renderChooseDirectory();

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
