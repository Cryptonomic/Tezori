// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TextField } from 'material-ui';
import { remote, shell } from 'electron';
import styled from 'styled-components';
import path from 'path';
import zxcvbn from 'zxcvbn';
import { ms } from '../styles/helpers';

import Button from './Button';
import BackButton from './BackButton';
import Checkbox from './Checkbox';
import MessageBar from './MessageBar';
import TermsModal from './TermsModal';
import Loader from './Loader';
import CREATION_CONSTANTS from '../constants/CreationTypes';
import TezosIcon from "./TezosIcon";
import {
  goHomeAndClearState,
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

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const TermsAndPolicySection = styled.div`
  display: flex;
  width: 80%;
  padding: ${ms(2)} 0 ${ms(4)} 0;
  border-top-width: 1px;
  border-top-color: ${ ({ theme: { colors } }) => colors.gray3 };
  border-top-style: solid;
  justify-content: center;
  align-items: center;
`

const Strong = styled.span`
  color: ${ ({ theme: { colors } }) => colors.accent };
`

const Link = styled(Strong)`
  cursor: pointer;
`

const Description = styled.span`
  color: ${ ({ theme: { typo: { weights } } }) => weights.light };
`

const Tip = styled(Description)`
  max-width: 300px;
  padding: ${ms(2)} 0 0 0;
`

const Filling = styled.div`
  height: 70px;
`

const CustomButton = styled(Button)`
  max-width: 300px;
`

const StyledInputContainer = styled.div`
  height: 126px;
`
const StyledInputContent = styled.div`
  width: 100%;
  position: relative;
  .input-text-field {
    width: 100% !important;
  }

`
const StyledSuggestion = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: #92949a;
  max-width: 438px;
`
const StyledCrackTime = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: ${props => (props.color)};
  span {
    font-weight: bold;
  }
`
const EyeIcon = styled(TezosIcon)`
  position: absolute;
  top: 38px;
  right: 10px;
`
const CheckIcon = styled(TezosIcon)`
  position: absolute;
  top: 42px;
  right: 40px;
`

type Props1 = {
  label: string,
  crackTime?: string,
  suggestion?: string,
  isShowed?: boolean,
  status?: boolean,
  score?: number,
  changFunc: Function,
  onShow: Function

};

const focusBorderColors = ['#2c7df7', '#ea776c', '#e69940', '#d3b53b', '#259c90'];

const InputValidComponent = (props: Props1) => {
  const borderColor = focusBorderColors[props.score];
  let width = '';
  if (props.score && !props.status) {
    width = `${props.score*25}%`;
  } else {
    width = `100%`;
  }

  return (
    <StyledInputContainer>
      <StyledInputContent>
        <TextField
          className='input-text-field'
          floatingLabelText={props.label}
          type={props.isShowed? 'text': 'password'}
          floatingLabelStyle={inputStyles.floatingLabelStyle}
          floatingLabelFocusStyle={inputStyles.floatingLabelFocusStyle}
          underlineStyle={inputStyles.underlineStyle}
          underlineFocusStyle={{borderColor, width}}                      
          onChange={(_, newVal) => props.changFunc(newVal)}
        />
        {props.score===4 && <CheckIcon
          iconName='checkmark2'
          size={ms(0)}
          color="check"
          onClick={props.onShow}
        />}

        <EyeIcon
          iconName={props.isShowed? 'view-hide': 'view-show'}
          size={ms(2)}
          color="secondary"
          onClick={props.onShow}
        />
      </StyledInputContent>
      {!!props.crackTime && <StyledCrackTime color={borderColor} dangerouslySetInnerHTML={{ __html: props.crackTime }} />}
      {!!props.suggestion && <StyledSuggestion>{props.suggestion}</StyledSuggestion>}

    </StyledInputContainer>
  )
};
InputValidComponent.defaultProps = {
  crackTime: '',
  suggestion: '',
  score: 0,
  isShowed: false,
  status: false
}

class Home extends Component<Props> {
  props: Props;
  
  state = {
    isAgreement: false,
    isPasswordValidation: false,    
    isPwdShowed: false,
    isPasswordMatched: false,
    isConfirmPwdShowed: false,
    pwdScore: 0,
    pwdCrackTime: '',
    pwdSuggestion: '',
    confirmPwdScore: 0,
    confirmPwdText: ''
  }

  componentWillMount = () => {
    const agreement = localStorage.getItem('isTezosTermsAndPolicyAgreementAccepted')
    const isAgreement = JSON.parse(agreement) || false
    this.setState({ isAgreement })
  }

  openLink = () => shell.openExternal('https://github.com/Cryptonomic/Tezos-Wallet')

  setDisplay = display => () => this.props.setDisplay(display);

  updateStatusAgreement = () => {
    const { isAgreement } = this.state
    this.setState({ isAgreement: !isAgreement })
    return localStorage.setItem('isTezosTermsAndPolicyAgreementAccepted', !isAgreement)
  }

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
      const pwdStrength = zxcvbn(val);
      const score = pwdStrength.score || 1;
      const crackTime = `Your password will take <span>${pwdStrength.crack_times_display.offline_slow_hashing_1e4_per_second}</span> to crack!`;
      let suggestion = pwdStrength.feedback.warning;
      pwdStrength.feedback.suggestions.forEach(item => {
        suggestion = `${suggestion} ${item}`;
      });

      const isValid = score === 4;
      const isPasswordMatched = confirmedPassword === val;

      this.setState({pwdScore: score, pwdCrackTime: crackTime, pwdSuggestion: suggestion, isPasswordValidation: isValid, isPasswordMatched});

    } else {
      this.setState({pwdScore: 0, pwdCrackTime: '', pwdSuggestion: '', isPasswordValidation: false, isPasswordMatched: false});
    }
    setPassword(val);
  }

  confirmPassword = (val) => {
    const { password, setConfirmedPassword } = this.props;
    const indexVal = password.indexOf(val);
    let score = 0;
    let isMatched = false;
    let confirmStr = '';
    if (password && password === val) {
      score = 4;
      isMatched = true;
      confirmStr = 'Passwords Match!';
    } else if (password !== val && indexVal<0 && val) {
      score = 1;
      isMatched = false;
      confirmStr = `Passwords don't Match!`;
    }
    this.setState({ isPasswordMatched: isMatched, confirmPwdScore: score, confirmPwdText: confirmStr });    
    setConfirmedPassword(val);
  }
 
  renderSelectionState = () => {
    return (
      <SectionContainer>
        <div className={styles.defaultContainer}>
          <div className={styles.walletContainers}>
            <div className={styles.walletTitle}>Create a new wallet</div>
            <CustomButton buttonTheme="primary" onClick={this.setDisplay(CREATE)} disabled={!this.state.isAgreement}>
              Create Wallet
            </CustomButton>
            <Tip>
              Want to import your funraiser account?
              <Strong> Create a wallet </Strong>
              first.
            </Tip>
          </div>
          <div className={styles.walletContainers}>
            <div className={styles.walletTitle}>Import an existing wallet</div>
            <CustomButton buttonTheme="secondary" onClick={this.setDisplay(IMPORT)} disabled={!this.state.isAgreement}>
              Import Wallet
            </CustomButton>
            <Filling />
          </div>
        </div>
        <TermsAndPolicySection>
          <Checkbox isChecked={this.state.isAgreement} onCheck={this.updateStatusAgreement} />
          <Description>
            I acknowledge that I have read and accepted
            <Link onClick={this.openLink}> the Terms of Service </Link>
            and
            <Link onClick={this.openLink}> Privacy Policy</Link>
          </Description>
        </TermsAndPolicySection>
        <TermsModal 
          isOpen={!this.state.isAgreement}
          agreeTermsAndPolicy={this.updateStatusAgreement}
        />
      </SectionContainer>
    );
  };
  onPasswordShow = (index) => {
    if (index) {
      this.setState({isConfirmPwdShowed: !this.state.isConfirmPwdShowed});
    } else {
      this.setState({isPwdShowed: !this.state.isPwdShowed});
    }
  }

  renderCreateWallet = () => {
    const {
      walletFileName,
      isLoading,
      message,
      submitAddress,
      goHomeAndClearState
    } = this.props;
    const isDisabled = isLoading || !this.state.isPasswordValidation || !this.state.isPasswordMatched || !walletFileName;

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <BackButton onClick={() => goHomeAndClearState()} />
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
          <InputValidComponent
            label='Create Password'
            isShowed={this.state.isPwdShowed}
            crackTime={this.state.pwdCrackTime}
            suggestion={this.state.pwdSuggestion}
            score={this.state.pwdScore}
            changFunc={this.changePassword}
            onShow={() => this.onPasswordShow(0)}            
          />
          <InputValidComponent
            label='Confirm Password'
            status
            isShowed={this.state.isConfirmPwdShowed}
            crackTime={this.state.confirmPwdText}
            score={this.state.confirmPwdScore}
            changFunc={this.confirmPassword}
            onShow={() => this.onPasswordShow(1)}            
          />
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
      walletLocation,
      goHomeAndClearState
    } = this.props;
    const completeWalletPath = path.join(walletLocation, walletFileName);

    return (
      <div className={styles.createContainer}>
        {isLoading && <Loader />}
        <div className={styles.walletContainers}>
          <BackButton onClick={() => goHomeAndClearState()} />
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
      goHomeAndClearState,
      setWalletFileName,
      setDisplay,
      setPassword,
      setConfirmedPassword,
      submitAddress,
      updateWalletLocation,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
