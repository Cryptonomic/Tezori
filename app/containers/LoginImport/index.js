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
import Loader from '../../components/Loader';
import TezosIcon from "../../components/TezosIcon";
import { IMPORT } from '../../constants/CreationTypes';
import { login } from '../../reduxContent/wallet/thunks';

import styles from './styles.css';

const InputContainer = styled.div`
  position: relative;
`
const EyeIcon = styled(TezosIcon)`
  position: absolute;
  top: 38px;
  right: 10px;
`
type Props1 = {
  isShowed: boolean,
  changFunc: Function,
  onShow: Function
};

const PasswordInput = (props: Props1) => {
  const { isShowed, changFunc, onShow } = props;
  return (
    <InputContainer>
      <TextField
        floatingLabelText="Wallet Password"
        style={{ width: '500px', marginBottom: ms(5) }}
        type={isShowed? 'text': 'password'}
        onChange={(_, password) => changFunc(password)}
      />
      <EyeIcon
        iconName={props.isShowed? 'view-hide': 'view-show'}
        size={ms(2)}
        color="secondary"
        onClick={onShow}
      />      
    </InputContainer>
  );
}

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

const dialogFilters = [{ name: 'Tezos Wallet', extensions: ['tezwallet'] }];

class LoginImport extends Component<Props> {
  props: Props;

  state = {
    isLoading: false,
    walletLocation: '',
    walletFileName: '',
    password: '',
    isShowed: false
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

  changePassword = (password) => {
    this.setState({ password });
  }

  onShow = () => {
    this.setState({isShowed: !this.state.isShowed});
  }

  render() {
    const { goBack } = this.props;
    const { walletFileName, walletLocation, password, isLoading } = this.state;

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
            Open an existing wallet
          </h3>
          <div className={styles.importButtonContainer}>
            <Button buttonTheme="secondary" onClick={this.openFile} small>
              Select Wallet File
            </Button>
            <span className={styles.walletFileName}>{walletFileName}</span>
          </div>
          <PasswordInput
            isShowed={this.state.isShowed}
            changFunc={this.changePassword}
            onShow={this.onShow}
          />
          <div className={styles.actionButtonContainer}>
            <Button
              className={styles.actionButton}
              onClick={() => this.login(IMPORT)}
              buttonTheme="primary"
              disabled={isLoading}
            >
              Import
            </Button>
          </div>
        </div>
      </div>
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
