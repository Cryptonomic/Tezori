// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack as back } from 'react-router-redux';
import styled from 'styled-components';
import { TextField } from 'material-ui';
import BackCaret from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import Warning from 'material-ui/svg-icons/alert/warning';
import { remote } from 'electron';
import path from 'path';
import PasswordValidator from 'password-validator';
import classnames from 'classnames';
import Tooltip from '../../components/Tooltip/';
import Button from '../../components/Button/';
import MessageBar from '../../components/MessageBar';
import Loader from '../../components/Loader';
import { CREATE } from '../../constants/CreationTypes';
import { login } from '../../redux/wallet/thunks';

import styles from './styles.css';


type Props = {
  message: Object,
  login: Function,
};

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
  }
};

const BackToWallet = styled.div`
  display: flex;
  align-items: center;
  color: #4486f0;
  cursor: pointer;
  margin-bottom: 3rem;
`;

const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

class LoginCreate extends Component<Props> {
  props: Props;

  state = {
    isLoading: false,
    walletLocation: false,
    walletFileName: false,
    password: false,
    confirmPassword: false,
    isAgreement: false,
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

  saveFile = () => {
    remote.dialog.showSaveDialog({ filters: dialogFilters }, filename => {
      if ( filename ) {
        this.setState({
          walletLocation: path.dirname(filename),
          walletFileName: path.basename(filename)
        });
      }
    });
  };
  
  changePassword = (password) => {
    const { confirmedPassword } = this.state;
    if (password) {
      if (!this.state.isInputPasswod) {
        this.setState({ isInputPasswod: true });
      }
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

      const isPwdMinLength = schemaLength.validate(password);
      const hasPwdUpperCase = schemaUppercase.validate(password);
      const hasPwdLowerCase = schemaLowerCase.validate(password);
      const hasPwdDigits = schemaDigits.validate(password);
      const hasPwdSymbols = schemaSymbols.validate(password);


      const isValid = isPwdMinLength && hasPwdUpperCase && hasPwdLowerCase && hasPwdDigits && hasPwdSymbols;
      this.setState({ isPasswordValidation: isValid, isPwdMinLength, hasPwdUpperCase, hasPwdLowerCase, hasPwdDigits, hasPwdSymbols});

      if (confirmedPassword === password){
        this.setState({ isPasswordMatched: true});
      } else {
        this.setState({ isPasswordMatched: false});
      }
    } else {
      this.setState({ isPasswordValidation: false });
    }
    this.setState({ password });
  };

  confirmPassword = (confirmPassword) => {
    const { password } = this.state;
    if (!this.state.isInputConfirmPassword) {
      this.setState({ isInputConfirmPassword: true });
    }

    if (this.state.isInputConfirmPassword && password && password === confirmPassword) {
      this.setState({ isPasswordMatched: true });
    } else {
      this.setState({ isPasswordMatched: false });
    }
    this.setState({ confirmPassword });
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
  };

  validText = (isInput: boolean = false, isValid: boolean = false, text: string) => {
    if (!isInput) {
      return (<div className={classnames(styles.validTooltipText, styles.grayFontColor)}>{text}</div>);
    }

    if (isValid) {
      return (<div className={classnames(styles.validTooltipText, styles.validFontColor)}>{text}</div>);
    }

    return (<div className={classnames(styles.validTooltipText, styles.invalidFontColor)}>{text}</div>);
  };

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
  );

  login = async (loginType) => {
    const { walletLocation, walletFileName, password } = this.state;
    const { login } = this.props;
    await login(loginType, walletLocation, walletFileName, password);
  };

  render() {
    const { message, goBack } = this.props;
    const { isLoading, walletFileName } = this.state;
    const isDisabled = isLoading || !this.state.isPasswordValidation || !this.state.isPasswordMatched || !walletFileName;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <BackToWallet
            onClick={goBack}
          >
            <BackCaret
              style={{
              fill: '#4486f0',
              height: '28px',
              width: '28px',
              marginRight: '5px',
              marginLeft: '-9px'
            }}
            />
            <span>Back</span>
          </BackToWallet>
          
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
              onClick={() => this.login(CREATE) }
              disabled={isDisabled}
            >
              Create Wallet
            </Button>
          </div>
        </div>
        <MessageBar message={message} />
      </div>
    );
  }
}

function mapStateToProps({ message }) {
  return {
    message: message.get('message')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    login,
    goBack: () => dispatch => dispatch(back())
  }, dispatch );
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginCreate);
