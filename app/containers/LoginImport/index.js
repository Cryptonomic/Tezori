// @flow
import React, { Component } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { goBack as back } from 'react-router-redux';
import styled from 'styled-components';
import BackCaret from '@material-ui/icons/KeyboardArrowLeft';
import { remote } from 'electron';
import path from 'path';

import Button from '../../components/Button/';
import Loader from '../../components/Loader';
import PasswordInput from '../../components/PasswordInput';
import { IMPORT } from '../../constants/CreationTypes';
import { login } from '../../reduxContent/wallet/thunks';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { wrapComponent } from '../../utils/i18n';

type Props = {
  login: () => {},
  goBack: () => {},
  t: () => {},
  isLoading: boolean
};

const BackToWallet = styled.div`
  display: flex;
  align-items: center;
  color: #4486f0;
  cursor: pointer;
  margin-bottom: 1rem;
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
  min-width: 500px;
`;

const WalletTitle = styled.h3`
  color: #1a325f;
  font-size: 36px;
  font-weight: 300;
  margin: 0 0 1.7rem 0;
`;

const ImportButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1.5rem;
`;

const WalletFileName = styled.span`
  font-size: 15px;
  margin-left: 15px;
  opacity: 0.5;
`;

const ActionButtonContainer = styled.div`
  width: 194px;
  margin-top: 39px;
`;

const ActionButton = styled(Button)`
  width: 194px;
  height: 50px;
  padding: 0;
`;

const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

class LoginImport extends Component<Props> {
  props: Props;
  state = {
    walletLocation: '',
    walletFileName: '',
    password: '',
    isShowedPwd: false
  };

  openFile = event => {
    if (event.detail === 0) {
      return;
    }
    remote.dialog.showOpenDialog(
      {
        properties: ['openFile'],
        filters: dialogFilters
      },
      filePaths => {
        if (filePaths && filePaths.length) {
          this.setState({
            walletLocation: path.dirname(filePaths[0]),
            walletFileName: path.basename(filePaths[0])
          });
        }
      }
    );
  };

  login = async loginType => {
    const { walletLocation, walletFileName, password } = this.state;
    const { login, setIsLoading } = this.props;
    await setIsLoading(true);
    await login(loginType, walletLocation, walletFileName, password);
  };

  changePassword = password => {
    this.setState({ password });
  };

  onShow = () => {
    this.setState({ isShowed: !this.state.isShowed });
  };

  onEnterPress = (keyVal, isDisabled) => {
    if (keyVal === 'Enter' && !isDisabled) {
      this.login(IMPORT);
    }
  };

  render() {
    const { goBack, t, isLoading } = this.props;
    const { walletFileName, password, isShowedPwd } = this.state;
    const isDisabled = isLoading || !walletFileName || !password;

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
                marginLeft: '-9px'
              }}
            />
            <span>{t('general.back')}</span>
          </BackToWallet>

          <WalletTitle>
            {t('containers.loginImport.open_wallet_label')}
          </WalletTitle>
          <ImportButtonContainer>
            <Button buttonTheme="secondary" onClick={this.openFile} small>
              {t('containers.loginImport.select_file_btn')}
            </Button>
            <WalletFileName>{walletFileName}</WalletFileName>
          </ImportButtonContainer>
          <PasswordInput
            label={t('general.nouns.wallet_password')}
            isShowed={isShowedPwd}
            password={password}
            changFunc={newpassword => this.setState({ password: newpassword })}
            onShow={() => this.setState({ isShowedPwd: !isShowedPwd })}
          />
          <ActionButtonContainer>
            <ActionButton
              onClick={() => this.login(IMPORT)}
              buttonTheme="primary"
              disabled={isDisabled}
            >
              {t('general.verbs.open')}
            </ActionButton>
          </ActionButtonContainer>
        </WalletContainers>
      </CreateContainer>
    );
  }
}
function mapStateToProps({ wallet }) {
  return {
    isLoading: wallet.get('isLoading')
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setIsLoading,
      login,
      goBack: () => dispatch => dispatch(back())
    },
    dispatch
  );
}

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(LoginImport);
