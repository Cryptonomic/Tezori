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
import Loader from '../../components/Loader/';
import { CREATE } from '../../constants/CreationTypes';
import { login } from '../../reduxContent/wallet/thunks';
import ValidInput from '../../components/ValidInput/';
import createFileEmptyIcon from '../../../resources/createFileEmpty.svg';
import TezosIcon from '../../components/TezosIcon/';

type Props = {
  login: () => {},
  goBack: () => {}
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

const CheckIcon = styled(TezosIcon)`
  display: block;
  margin-bottom: 15px;
`;

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

const CreateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const WalletContainers = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 30px;
`;

const WalletTitle = styled.h3`
  color: #1A325F;
  font-size: 36px;
  font-weight: 300;
  margin: 0 0 0.75rem 0;
`;

const WalletDescription = styled.div`
  font-size: 18px;
  font-weight: 300;
  line-height: 27px;
  letter-spacing: 0.7px;
  color: #1e1313;
  max-width: 659px;
`;

const ActionButtonContainer = styled.div`
  width: 194px;
  margin-top: 40px;
  display: flex;
  align-self: center;
`;

const ActionButton = styled(Button)`
  width: 194px;
  height: 50px;
  padding: 0;
`;

const FormContainer = styled.div`
  display: flex;
  margin-top: 1rem;
`;

const PasswordsContainer = styled.div`
 display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

const CreateFileEmptyIcon = styled.img`
  height: 6.75rem;
  margin-bottom: 1.18rem;
`;

const CreateFileButton = styled(Button)`
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 9.18rem !important;
  margin-bottom: 1.6rem !important;
`;

const WalletFileSection = styled.div`
  text-align: center;
  margin-bottom: 1.125rem;
`;


const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

class LoginCreate extends Component<Props> {
  props: Props;

  state = {
    isLoading: false,
    walletLocation: false,
    walletFileName: false,
    password: '',
    confirmPassword: '',
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
      <CreateFileEmptyIcon src={createFileEmptyIcon} />
    );

    if (walletFileName) {
      walletFileSection = (
        <WalletFileSection>
          <CheckIcon
            iconName="checkmark2"
            size={ms(5)}
            color="check"
          />
          <WalletFileName>
            { walletFileName }
          </WalletFileName>
        </WalletFileSection>
      );
    }

    return (
      <CreateContainer>
        {isLoading && <Loader />}
        <WalletContainers>
          <BackToWallet
            onClick={goBack}
          >
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

          <WalletTitle>Create a new wallet</WalletTitle>
          <WalletDescription>
            Your wallet information will be saved to your computer. It will be encrypted with a password that you set.
          </WalletDescription>
          <FormContainer>
            <CreateFileSelector>
              {walletFileSection}
              <CreateFileButton
                buttonTheme="secondary"
                onClick={this.saveFile}
                small
              >
                Create Wallet File
              </CreateFileButton>
            </CreateFileSelector>
            <PasswordsContainer>
              <ValidInput
                label="Create Wallet Password"
                isShowed={this.state.isPwdShowed}
                error={this.state.pwdError}
                suggestion={this.state.pwdSuggestion}
                score={this.state.pwdScore}
                changFunc={this.changePassword}
                onShow={() => this.onPasswordShow(0)}
              />
              <ValidInput
                label="Confirm Wallet Password"
                status
                isShowed={this.state.isConfirmPwdShowed}
                error={this.state.confirmPwdText}
                score={this.state.confirmPwdScore}
                changFunc={this.confirmPassword}
                onShow={() => this.onPasswordShow(1)}
              />
            </PasswordsContainer>
          </FormContainer>
          <ActionButtonContainer>
            <ActionButton
              buttonTheme="primary"
              onClick={() => this.login(CREATE)}
              disabled={isDisabled}
            >
              Create Wallet
            </ActionButton>
          </ActionButtonContainer>
        </WalletContainers>
      </CreateContainer>
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
