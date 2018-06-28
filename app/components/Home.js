// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Warning from 'material-ui/svg-icons/alert/warning';
import { remote } from 'electron';
import path from 'path';
import PasswordValidator from 'password-validator';
import classnames from 'classnames';
import { ms } from '../styles/helpers';

import Tooltip from './Tooltip';
import Button from './Button';
import MessageBar from './MessageBar';
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

interface IState {
  isInputPasswod: boolean,
  isPasswordValidation: boolean,
  isInputConfirmPassword: boolean,
  isPasswordMatched: boolean,
  isPwdMinLength: boolean,
  hasPwdUpperCase: boolean,
  hasPwdLowerCase: boolean,
  hasPwdDigits: boolean,
  hasPwdSymbols: boolean
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
      isPwdMinLength: false,
      hasPwdUpperCase: false,
      hasPwdLowerCase: false,
      hasPwdDigits: false,
      hasPwdSymbols: false
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
  changePassword = (val) => {
    const { confirmedPassword, setPassword } = this.props;
    if (val) {
      if (!this.state.isInputPasswod) this.setState({ isInputPasswod: true });
      const schemaLength = new PasswordValidator();
      const schemaUppercase = new PasswordValidator();
      const schemaLowerCase = new PasswordValidator();
      const schemaDigits = new PasswordValidator();
      const schemaSymbols = new PasswordValidator();
      schemaLength.is().min(8).is().max(100).has().not().spaces();
      schemaUppercase.has().uppercase().has().not().spaces();
      schemaLowerCase.has().lowercase().has().not().spaces();
      schemaDigits.has().digits().has().not().spaces();
      schemaSymbols.has().symbols().has().not().spaces();

      const isPwdMinLength = schemaLength.validate(val);
      const hasPwdUpperCase = schemaUppercase.validate(val);
      const hasPwdLowerCase = schemaLowerCase.validate(val);
      const hasPwdDigits = schemaDigits.validate(val);
      const hasPwdSymbols = schemaSymbols.validate(val);

      
  
      const isValid = isPwdMinLength && hasPwdUpperCase && hasPwdLowerCase && hasPwdDigits && hasPwdSymbols;      
      this.setState({ isPasswordValidation: isValid, isPwdMinLength, hasPwdUpperCase, hasPwdLowerCase, hasPwdDigits, hasPwdSymbols});

      if (confirmedPassword === val){
        this.setState({ isPasswordMatched: true});
      } else {
        this.setState({ isPasswordMatched: false});
      }
    } else {
      this.setState({ isPasswordValidation: false });
    }
    setPassword(val);
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

  inputTextField = (
    label: string,
    type: string,    
    changFunc: Function,
    isErrorUnderline: boolean = false
  ) => {
    return (
      <TextField
        floatingLabelText={label}
        className={styles.inputTextField}
        type={type}
        floatingLabelStyle={inputStyles.floatingLabelStyle}
        floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
        underlineStyle={isErrorUnderline? inputStyles.errorUnderlineStyle : inputStyles.underlineStyle}
        underlineFocusStyle={isErrorUnderline? inputStyles.errorUnderlineStyle : inputStyles.underlineFocusStyle}            
        onChange={(_, newVal) => changFunc(newVal)}
      />
    );
  };

  validIcon = (isShow: boolean = false, isInput: boolean = false, isValid: boolean = false, size: number = 20) => {
    if (!isShow) {
      return null;
    }
    if (!isInput) {
      return (<CheckCircle className={classnames(styles.validIcon, styles.grayIconColor)} style={{height: size, width: size}} />);
    }
    if (isValid) {
      return (<CheckCircle className={classnames(styles.validIcon, styles.validIconColor)} style={{height: size, width: size}} />);
    }
    return (<Warning className={styles.noValidIcon} style={{height: size, width: size}} />);
  }

  validText = (isInput: boolean = false, isValid: boolean = false, text: string) => {
    if (!isInput) {
      return (<div className={classnames(styles.validTooltipText, styles.grayFontColor)}>{text}</div>);
    }

    if (isValid) {
      return (<div className={classnames(styles.validTooltipText, styles.validFontColor)}>{text}</div>);
    }

    return (<div className={classnames(styles.validTooltipText, styles.invalidFontColor)}>{text}</div>);

  }

  pwdValidationTooltip = () => (
    <div className={styles.validTooltipContainer}>
      <div className={styles.validTooltipContent}>
        {this.validIcon(true, this.state.isInputPasswod, this.state.isPwdMinLength, 14)}
        {this.validText(this.state.isInputPasswod, this.state.isPwdMinLength, 'At least 8 characters')}
      </div>
      <div className={styles.validTooltipContent}>
        {this.validIcon(true, this.state.isInputPasswod, this.state.hasPwdUpperCase, 14)}
        {this.validText(this.state.isInputPasswod, this.state.hasPwdUpperCase, '1 upper case')}
      </div>
      <div className={styles.validTooltipContent}>
        {this.validIcon(true, this.state.isInputPasswod, this.state.hasPwdLowerCase, 14)}
        {this.validText(this.state.isInputPasswod, this.state.hasPwdLowerCase, '1 lower case')}
      </div>
      <div className={styles.validTooltipContent}>
        {this.validIcon(true, this.state.isInputPasswod, this.state.hasPwdSymbols, 14)}
        {this.validText(this.state.isInputPasswod, this.state.hasPwdSymbols, '1 special character')}
      </div>
      <div className={styles.validTooltipContent}>
        {this.validIcon(true, this.state.isInputPasswod, this.state.hasPwdDigits, 14)}
        {this.validText(this.state.isInputPasswod, this.state.hasPwdDigits, '1 number')}
      </div>
    </div>
  )
 
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
      submitAddress
    } = this.props;
    const isDisabled = isLoading || !this.state.isPasswordValidation || !this.state.isPasswordMatched || !walletFileName;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <h3 className={styles.walletTitle}>Create a new wallet</h3>
          <div className={styles.walletDescription}>
            Your wallet information will be saved to your computer. It will be encrypted with a password that you set.
          </div>
          <div className={styles.importButtonContainer}>
            <Button buttonTheme="secondary" onClick={this.saveFile} small>
              Create Wallet File
            </Button>
            <span className={styles.walletFileName}>{walletFileName}</span>
          </div>
          <div className={styles.inputContainer}>
            {this.inputTextField('Create Password', 'password', this.changePassword, this.state.isInputPasswod && !this.state.isPasswordValidation)}
            <Tooltip position="top" content={this.pwdValidationTooltip}>
              <Button buttonTheme="plain" className={styles.validationIcon}>
                {this.validIcon(true, this.state.isInputPasswod, this.state.isPasswordValidation)}
              </Button>
            </Tooltip>
          </div>

          <div className={styles.inputContainer}>
            {this.inputTextField('Confirm Password', 'password', this.confirmPassword, this.state.isInputConfirmPassword && !this.state.isPasswordMatched)}
            <Button buttonTheme="plain" className={styles.validationIcon}>
              {this.validIcon(this.state.isInputConfirmPassword, true, this.state.isPasswordMatched)}
            </Button>            
          </div>
          <div className={styles.actionButtonContainer}>
            <Button
              className={styles.actionButton}
              buttonTheme="primary"
              onClick={() => submitAddress(CREATE)}
              disabled={isDisabled}
            >
              Create Wallet
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
