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
import MessageBar from '../../components/MessageBar';
import Loader from '../../components/Loader';
import { IMPORT } from '../../constants/CreationTypes';
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

class LoginImport extends Component<Props> {
  props: Props;

  state = {
    isLoading: false,
    walletLocation: '',
    walletFileName: '',
    password: '',
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
    const { login, history } = this.props;
    this.setState({ isLoading: true });
    const loggedIn = await login(loginType, walletLocation, walletFileName, password);
    this.setState({ isLoading: false });
    if ( loggedIn ) {
      history.push('/home');
    }
  };

  render() {
    const { message, goBack } = this.props;
    const { walletFileName, walletLocation, password, isLoading } = this.state;
    const completeWalletPath = path.join(walletLocation, walletFileName);

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
            value={ password }
            onChange={(_, password) => this.setState({ password })}
          />
          <Button
            onClick={() => this.login(IMPORT) }
            buttonTheme="primary"
            disabled={isLoading}
          >
            Import
          </Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginImport);
