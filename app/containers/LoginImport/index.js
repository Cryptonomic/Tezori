// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack as back } from 'react-router-redux';
import styled from 'styled-components';
import { TextField } from 'material-ui';
import BackCaret from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import { remote } from 'electron';
import path from 'path';
import { ms } from '../../styles/helpers';

import Button from '../../components/Button/';
import Loader from '../../components/Loader/';
import { IMPORT } from '../../constants/CreationTypes';
import { login } from '../../reduxContent/wallet/thunks';

type Props = {
  login: Function,
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
`;

const WalletTitle = styled.h3`
  color: #1A325F;
  font-size: 36px;
  font-weight: 300;
  margin: 0 0 1.7rem 0;
`;

const ImportButtonContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0;
  margin-bottom: 1rem;
`;

const WalletFileName = styled.span`
  font-size: 15px;
  margin-left: 15px;
  opacity: 0.5;
`;

const ActionButtonContainer = styled.div`
  width: 194px;
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
    isLoading: false,
    walletLocation: '',
    walletFileName: '',
    password: ''
  };

  openFile = () => {
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

  login = async (loginType) => {
    const { walletLocation, walletFileName, password } = this.state;
    const { login } = this.props;
    await login(loginType, walletLocation, walletFileName, password);
  };

  render() {
    const { goBack } = this.props;
    const { walletFileName, walletLocation, password, isLoading } = this.state;

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
              marginLeft: '-9px'
            }}
            />
            <span>Back</span>
          </BackToWallet>

          <WalletTitle>
            Open an existing wallet
          </WalletTitle>
          <ImportButtonContainer>
            <Button buttonTheme="secondary" onClick={this.openFile} small>
              Select Wallet File
            </Button>
            <WalletFileName>
              { walletFileName }
            </WalletFileName>
          </ImportButtonContainer>
          <TextField
            floatingLabelText="Wallet Password"
            style={{ width: '500px', marginBottom: ms(5) }}
            type="password"
            value={password}
            onChange={(_, password) => this.setState({ password })}
          />
          <ActionButtonContainer>
            <ActionButton
              onClick={() => this.login(IMPORT)}
              buttonTheme="primary"
              disabled={isLoading}
            >
              Import
            </ActionButton>
          </ActionButtonContainer>
        </WalletContainers>
      </CreateContainer>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
    login,
    goBack: () => dispatch => dispatch(back())
  }, dispatch );
}

export default connect(null, mapDispatchToProps)(LoginImport);
