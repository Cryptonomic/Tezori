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
`;

const Strong = styled.span`
  color: ${ ({ theme: { colors } }) => colors.accent };
`;

const Link = styled(Strong)`
  cursor: pointer;
`;

const Description = styled.span`
  color: ${ ({ theme: { typo: { weights } } }) => weights.light };
`;

const Tip = styled(Description)`
  max-width: 300px;
  padding: ${ms(2)} 0 0 0;
`;

const Filling = styled.div`
  height: 70px;
`;

const CustomButton = styled(Button)`
  max-width: 300px;
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
          <div className={styles.walletContainers}>
            <div className={styles.walletTitle}>Create a new wallet</div>
            <CustomButton 
              buttonTheme="primary" 
              onClick={() => this.goTo('create')} 
              disabled={!this.state.isAgreement}
            >
              Create Wallet
            </CustomButton>
            <Tip>
              Want to import your fundraiser account?
              <Strong> Create a wallet </Strong>
              first.
            </Tip>
          </div>
          <div className={styles.walletContainers}>
            <div className={styles.walletTitle}>Import an existing wallet</div>
            <CustomButton 
              buttonTheme="secondary"
              onClick={() => this.goTo('import')}
              disabled={!this.state.isAgreement}
            >
              Import Wallet
            </CustomButton>
            <Filling />
          </div>
        </div>
        <TermsAndPolicySection>
          <Checkbox isChecked={this.state.isAgreement} onCheck={this.updateStatusAgreement}/>
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
  }
}

export default connect()(LoginHome);
