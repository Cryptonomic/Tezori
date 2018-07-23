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
import { ms } from '../../styles/helpers';
import Button from '../../components/Button/';
import Loader from '../../components/Loader';
import { CREATE } from '../../constants/CreationTypes';
import { login } from '../../reduxContent/wallet/thunks';
import ValidInput from '../../components/ValidInput';
import createFileEmptyIcon from '../../../resources/createFileEmpty.svg';
import TezosIcon from '../../components/TezosIcon';

import styles from './styles.css';

type Props = {
  login: Function,
  goBack: Function
};

const BackToWallet = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  color: #4486f0;
  cursor: pointer;
  margin-bottom: 1rem;
`;

const WalletFileName = styled.div`
  font-size: 15px;
  font-weight: 300;
  letter-spacing: -0.7px;
  color: ${({ theme: { colors } }) => colors.accent};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 10rem;
`;

const CheckIcon = styled(TezosIcon)``;

const CreateFileSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-direction: column;
  border-width: 1.5px;
  border-style: dashed;
  border-color: ${({ theme: { colors } }) => colors.gray9};
  background: white;
  border-radius: 5px;
  width: 13rem;
  height: 13.5rem;
  margin-right: 2.37rem;
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
    pwdError: '',
    pwdSuggestion: '',
    confirmPwdScore: 0,
    confirmPwdText: ''
  };

  saveFile = () => {
    remote.dialog.showSaveDialog({ filters: dialogFilters }, filename => {
      if (filename) {
        this.setState({
          walletLocation: path.dirname(filename),
          walletFileName: path.basename(filename)
        });
      }
    });
  };

  changePassword = password => {
    const { confirmPassword } = this.state;
    if (password) {
      const pwdStrength = zxcvbn(password);
      const score = pwdStrength.score || 1;
      let crackTime = `It will take <span>${
        pwdStrength.crack_times_display.offline_slow_hashing_1e4_per_second
      }</span> to crack!`;
      let error = '';
      if (score < 3) {
        error = 'Your password is not strong enough.';
        crackTime += ' Add another word or two.';
      } else if (score === 3) {
        error = 'You are almost there!';
        crackTime += ' Add another word or two.';
      } else {
        error = 'You got it!';
      }

      const isValid = score === 4;
      this.setState({
        pwdScore: score,
        pwdError: error,
        pwdSuggestion: crackTime,
        isPasswordValidation: isValid,
        password
      });
    } else {
      this.setState({
        pwdScore: 0,
        pwdError: '',
        pwdSuggestion: '',
        isPasswordValidation: false,
        password
      });
    }

    if (confirmPassword && confirmPassword !== password) {
      this.setState({
        isPasswordMatched: false,
        confirmPwdScore: 1,
        confirmPwdText: "Passwords don't Match!"
      });
    } else if (confirmPassword && confirmPassword === password) {
      this.setState({
        isPasswordMatched: true,
        confirmPwdScore: 4,
        confirmPwdText: 'Passwords Match!'
      });
    }
  };

  confirmPassword = confirmPassword => {
    const { password } = this.state;
    const indexVal = password.indexOf(confirmPassword);
    let score = 0;
    let isMatched = false;
    let confirmStr = '';
    if (password && password === confirmPassword) {
      score = 4;
      isMatched = true;
      confirmStr = 'Passwords Match!';
    } else if (
      password !== confirmPassword &&
      indexVal < 0 &&
      confirmPassword
    ) {
      score = 1;
      isMatched = false;
      confirmStr = `Passwords don't Match!`;
    }
    this.setState({
      isPasswordMatched: isMatched,
      confirmPwdScore: score,
      confirmPwdText: confirmStr,
      confirmPassword
    });
  };

  login = async loginType => {
    const { walletLocation, walletFileName, password } = this.state;
    const { login } = this.props;
    await login(loginType, walletLocation, walletFileName, password);
  };

  onPasswordShow = index => {
    if (index) {
      this.setState({ isConfirmPwdShowed: !this.state.isConfirmPwdShowed });
    } else {
      this.setState({ isPwdShowed: !this.state.isPwdShowed });
    }
  };

  render() {
    const { goBack } = this.props;
    const { isLoading, walletFileName } = this.state;
    const isDisabled =
      isLoading ||
      !this.state.isPasswordValidation ||
      !this.state.isPasswordMatched ||
      !walletFileName;
    let walletFileSection = (
      <img
        className={styles.createFileEmptyIcon}
        src={createFileEmptyIcon}
        alt=""
      />
    );

    if (walletFileName) {
      walletFileSection = (
        <div className={styles.walletFileSection}>
          <CheckIcon
            iconName="checkmark2"
            size={ms(5)}
            color="check"
            className={styles.checkMark}
          />
          <WalletFileName>{walletFileName}</WalletFileName>
        </div>
      );
    }

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <BackToWallet onClick={goBack}>
            <BackCaret
              style={{
                fill: '#4486f0',
                height: '28px',
                width: '28px',
                marginRight: '5px',
                marginLeft: '-9px',
                marginTop: '4px'
              }}
            />
            <span>Back</span>
          </BackToWallet>

          <h3 className={styles.walletTitle}>Create a new wallet</h3>
          <div className={styles.walletDescription}>
            Your wallet information will be saved to your computer. It will be
            encrypted with a password that you set.
          </div>
          <div className={styles.formContainer}>
            <CreateFileSelector>
              {walletFileSection}
              <Button
                buttonTheme="secondary"
                onClick={this.saveFile}
                small
                className={styles.createFileButton}
              >
                Create Wallet File
              </Button>
            </CreateFileSelector>
            <div className={styles.passwordsContainer}>
              <ValidInput
                label="Create Wallet Password"
                isShowed={this.state.isPwdShowed}
                error={this.state.pwdError}
                suggestion={this.state.pwdSuggestion}
                score={this.state.pwdScore}
                changFunc={this.changePassword}
                className={styles.createPasswordField}
                onShow={() => this.onPasswordShow(0)}
              />
              <ValidInput
                label="Confirm Wallet Password"
                status
                isShowed={this.state.isConfirmPwdShowed}
                error={this.state.confirmPwdText}
                score={this.state.confirmPwdScore}
                changFunc={this.confirmPassword}
                className={styles.confirmPasswordField}
                onShow={() => this.onPasswordShow(1)}
              />
            </div>
          </div>
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
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      login,
      goBack: () => dispatch => dispatch(back())
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(LoginCreate);
