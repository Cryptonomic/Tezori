// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Button from '../../components/Button/';
import Checkbox from '../../components/Checkbox/';
import TermsModal from '../../components/TermsModal/';
import { shell } from 'electron';
import styles from './styles.css';

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const TermsAndPolicySection = styled.div`
  display: flex;
  width: 80%;
  padding: ${ms(2)} 0 ${ms(4)} 0;
  border-top-width: 1px;
  border-top-color: ${ ({ theme: { colors } }) => colors.gray3 };
  border-top-style: solid;
  justify-content: center;
  align-items: center;
  font-weight: 300;
`;

const Strong = styled.span`
  color: ${ ({ theme: { colors } }) => colors.accent };
  font-weight: 400;
`;

const Link = styled(Strong)`
  cursor: pointer;
`;

const Description = styled.span`
  margin-left: -10px;
`;

const Tip = styled(Description)`
  padding: ${ms(2)} 0 0 0;
  text-align: center;
  margin: 0 auto;
  line-height: 1.31rem;
  font-weight: 300;
`;

const AppName = styled.h1`
  text-align: center;
  width: 100%;
  font-family: 'Roboto', san-serif;
  font-style: normal;
  font-stretch: normal;
  font-size: 7.5rem;
  font-weight: 300;
  line-height: 7.5rem;
  letter-spacing: 0.5rem;
  margin: 0 auto;
  color: ${ ({ theme: { colors } }) => colors.primary };
`;

const AppSubtitle = styled.h2`
  text-align: center;
  width: 100%;
  font-family: 'Roboto', san-serif;
  font-style: normal;
  font-stretch: normal;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.5rem;
  letter-spacing: 0.25rem;
  margin: 0 auto 1.25rem;
  color: ${ ({ theme: { colors } }) => colors.primary };
`;

const CreateWalletButton = styled(Button)`
  min-width: 22rem;
  width: 100%;
`;

const UnlockWalletButton = styled(Button)`
  min-width: 22rem;
  width: 100%;
`;

const AGREEMENT_STORAGE = 'isTezosTermsAndPolicyAgreementAccepted';

class LoginHome extends Component<Props> {
  props: Props;

  state = {
    isAgreement: false
  };

  componentWillMount = () => {
    const agreement = localStorage.getItem(AGREEMENT_STORAGE);
    const isAgreement = JSON.parse(agreement) || false;
    this.setState({ isAgreement });
  };

  updateStatusAgreement = () => {
    const { isAgreement } = this.state;
    this.setState({ isAgreement: !isAgreement });
    return localStorage.setItem(AGREEMENT_STORAGE, !isAgreement);
  };

  openLink = () => shell.openExternal('https://github.com/Cryptonomic/Tezos-Wallet');

  goTo = (route) => {
    const { match, history } = this.props;
    history.push(`${match.path}/${ route }`);
  };

  render() {
    return (
      <SectionContainer>
        <div className={styles.defaultContainer}>
          <section className={styles.headerContainer}>
            <AppName>Galleon</AppName>
            <AppSubtitle>Beta Wallet for Tezos Betanet</AppSubtitle>
          </section>
          <section className={styles.optionsContainer}>
            <div className={styles.walletContainers}>
              <CreateWalletButton 
                buttonTheme="primary" 
                onClick={() => this.goTo('create')} 
                disabled={!this.state.isAgreement}
              >
                Create Wallet
              </CreateWalletButton>
            </div>
            <div className={styles.walletContainers}>
              <UnlockWalletButton 
                buttonTheme="secondary"
                onClick={() => this.goTo('import')}
                disabled={!this.state.isAgreement}
                className={styles.unlockWalletButton}
              >
                Unlock Existing Wallet
              </UnlockWalletButton>
              <Tip>
                <div>Want to import your Fundraiser paper wallet?</div>
                <div><Link onClick={() => this.goTo('create')}><Strong>Create a Galleon wallet</Strong></Link> first.</div>
              </Tip>
            </div>
          </section>
        </div>
        <TermsAndPolicySection>
          <Checkbox isChecked={this.state.isAgreement} onCheck={this.updateStatusAgreement}/>
          <Description>
            I acknowledge that I have read and accepted the
            <Link onClick={this.openLink}> Terms of Service </Link>
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
  }
}

export default connect()(LoginHome);
