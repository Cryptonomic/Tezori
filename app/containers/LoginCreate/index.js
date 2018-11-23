// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { goBack as back } from 'react-router-redux';
import styled from 'styled-components';
import BackCaret from '@material-ui/icons/KeyboardArrowLeft';
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
import { wrapComponent } from '../../utils/i18n';

type Props = {
  login: () => {},
  goBack: () => {},
  t: () => {}
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
  color: #1a325f;
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
  margin-top: 37px;
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
  justify-content: flex-end;
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

  saveFile = event => {
    const { walletLocation, walletFileName } = this.state;
    if (event.detail === 0 && walletLocation && walletFileName) {
      return;
    }
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
    const { t } = this.props;
    if (password) {
      const pwdStrength = zxcvbn(password);
      const score = pwdStrength.score || 1;
      //    let crackTime = t("containers.loginCreate.crack_time_description", {time: pwdStrength.crack_times_display.offline_slow_hashing_1e4_per_second});
      let error = '';
      if (score < 3) {
        error = t('containers.loginCreate.password_not_strong');
        //    crackTime += t("containers.loginCreate.add_another_word");
      } else if (score === 3) {
        error = t('containers.loginCreate.you_almost_there');
        //    crackTime += t("containers.loginCreate.add_another_word");
      } else {
        error = t('containers.loginCreate.you_got_it');
      }

      const isValid = score === 4;
      this.setState({
        pwdScore: score,
        pwdError: error,
        //  pwdSuggestion: crackTime,
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
        confirmPwdText: t('containers.loginCreate.password_dont_match')
      });
    } else if (confirmPassword && confirmPassword === password) {
      this.setState({
        isPasswordMatched: true,
        confirmPwdScore: 4,
        confirmPwdText: t('containers.loginCreate.password_match')
      });
    }
  };

  confirmPassword = confirmPassword => {
    const { password } = this.state;
    const { t } = this.props;
    const indexVal = password.indexOf(confirmPassword);
    let score = 0;
    let isMatched = false;
    let confirmStr = '';
    if (password && password === confirmPassword) {
      score = 4;
      isMatched = true;
      confirmStr = t('containers.loginCreate.password_match');
    } else if (
      password !== confirmPassword &&
      indexVal < 0 &&
      confirmPassword
    ) {
      score = 1;
      isMatched = false;
      confirmStr = t('containers.loginCreate.password_dont_match');
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
    await this.setIsLoading(true);
    await setTimeout(() => {
      login(loginType, walletLocation, walletFileName, password);
    }, 5);
  };

  onPasswordShow = index => {
    if (index) {
      this.setState({ isConfirmPwdShowed: !this.state.isConfirmPwdShowed });
    } else {
      this.setState({ isPwdShowed: !this.state.isPwdShowed });
    }
  };

  setIsLoading = isLoading => {
    this.setState({ isLoading });
  };

  onEnterPress = async (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      await this.login(CREATE);
    }
  };

  render() {
    const { goBack, t } = this.props;
    const { isLoading, walletFileName } = this.state;
    const isDisabled =
      isLoading ||
      !this.state.isPasswordValidation ||
      !this.state.isPasswordMatched ||
      !walletFileName;

    let walletFileSection = <CreateFileEmptyIcon src={createFileEmptyIcon} />;

    if (walletFileName) {
      walletFileSection = (
        <WalletFileSection>
          <CheckIcon iconName="checkmark2" size={ms(5)} color="check" />
          <WalletFileName>{walletFileName}</WalletFileName>
        </WalletFileSection>
      );
    }

    return (
      <CreateContainer
        onKeyDown={event => this.onEnterPress(event.key, isDisabled)}
      >
        {isLoading && <Loader />}
        <WalletContainers>
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
            <span>{t('general.back')}</span>
          </BackToWallet>

          <WalletTitle>
            {t('containers.loginCreate.create_wallet_title')}
          </WalletTitle>
          <WalletDescription>
            {t('containers.loginCreate.create_wallet_description')}
          </WalletDescription>
          <FormContainer>
            <CreateFileSelector>
              {walletFileSection}
              <CreateFileButton
                buttonTheme="secondary"
                onClick={this.saveFile}
                small
              >
                {t('containers.loginCreate.create_new_wallet_btn')}
              </CreateFileButton>
            </CreateFileSelector>
            <PasswordsContainer>
              <ValidInput
                label={t('containers.loginCreate.create_wallet_password_label')}
                isShowed={this.state.isPwdShowed}
                error={this.state.pwdError}
                suggestion={this.state.pwdSuggestion}
                score={this.state.pwdScore}
                changFunc={this.changePassword}
                onShow={() => this.onPasswordShow(0)}
              />
              <ValidInput
                label={t(
                  'containers.loginCreate.confirm_wallet_password_label'
                )}
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
              {t('containers.loginCreate.create_wallet_btn')}
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

export default compose(
  wrapComponent,
  connect(
    null,
    mapDispatchToProps
  )
)(LoginCreate);
