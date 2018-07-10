// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack as back } from 'react-router-redux';
import styled from 'styled-components';
import BackCaret from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import { remote } from 'electron';
import path from 'path';
import zxcvbn from 'zxcvbn';
import Button from '../../components/Button/';
import MessageBar from '../../components/MessageBar';
import Loader from '../../components/Loader';
import { CREATE } from '../../constants/CreationTypes';
import { login } from '../../reduxContent/wallet/thunks';
import ValidInput from '../../components/ValidInput'

import styles from './styles.css';


type Props = {
  message: Object,
  login: Function,
  goBack: Function
};

const BackToWallet = styled.div`
  display: flex;
  align-items: center;
  color: #4486f0;
  cursor: pointer;
  margin-bottom: 1rem;
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
    isPasswordValidation: false,    
    isPwdShowed: false,
    isPasswordMatched: false,
    isConfirmPwdShowed: false,
    pwdScore: 0,
    pwdCrackTime: '',
    pwdSuggestion: '',
    confirmPwdScore: 0,
    confirmPwdText: ''
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
    const { confirmPassword } = this.state;
    if (password) {
      const pwdStrength = zxcvbn(password);
      const score = pwdStrength.score || 1;
      const crackTime = `Your password will take <span>${pwdStrength.crack_times_display.offline_slow_hashing_1e4_per_second}</span> to crack!`;
      let suggestion = pwdStrength.feedback.warning;
      pwdStrength.feedback.suggestions.forEach(item => {
        suggestion = `${suggestion} ${item}`;
      });

      const isValid = score === 4;
      this.setState({pwdScore: score, pwdCrackTime: crackTime, pwdSuggestion: suggestion, isPasswordValidation: isValid, password});
    } else {
      this.setState({pwdScore: 0, pwdCrackTime: '', pwdSuggestion: '', isPasswordValidation: false, password});
    }

    if (confirmPassword && confirmPassword !== password) {
      this.setState({ isPasswordMatched: false, confirmPwdScore: 1, confirmPwdText: "Passwords don't Match!" });
    } else if ((confirmPassword && confirmPassword === password)){
      this.setState({ isPasswordMatched: true, confirmPwdScore: 4, confirmPwdText: "Passwords Match!" });
    }
  };

  confirmPassword = (confirmPassword) => {
    const { password } = this.state;
    const indexVal = password.indexOf(confirmPassword);
    let score = 0;
    let isMatched = false;
    let confirmStr = '';
    if (password && password === confirmPassword) {
      score = 4;
      isMatched = true;
      confirmStr = 'Passwords Match!';
    } else if (password !== confirmPassword && indexVal<0 && confirmPassword) {
      score = 1;
      isMatched = false;
      confirmStr = `Passwords don't Match!`;
    }
    this.setState({ isPasswordMatched: isMatched, confirmPwdScore: score, confirmPwdText: confirmStr, confirmPassword });
  };

  login = async (loginType) => {
    const { walletLocation, walletFileName, password } = this.state;
    const { login } = this.props;
    await login(loginType, walletLocation, walletFileName, password);
  };
  
  onPasswordShow = (index) => {
    if (index) {
      this.setState({isConfirmPwdShowed: !this.state.isConfirmPwdShowed});
    } else {
      this.setState({isPwdShowed: !this.state.isPwdShowed});
    }
  }

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
          <ValidInput
            label='Create Wallet Password'
            isShowed={this.state.isPwdShowed}
            crackTime={this.state.pwdCrackTime}
            suggestion={this.state.pwdSuggestion}
            score={this.state.pwdScore}
            changFunc={this.changePassword}
            className={styles.createPasswordField}
            onShow={() => this.onPasswordShow(0)}            
          />
          <ValidInput
            label='Confirm Wallet Password'
            status
            isShowed={this.state.isConfirmPwdShowed}
            crackTime={this.state.confirmPwdText}
            score={this.state.confirmPwdScore}
            changFunc={this.confirmPassword}
            className={styles.confirmPasswordField}
            onShow={() => this.onPasswordShow(1)}            
          />
          <div className={styles.actionButtonContainer}>
            <Button
              className={styles.actionButton}
              buttonTheme="primary"
              onClick={() => this.login(CREATE)}
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
