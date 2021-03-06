// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { Trans } from 'react-i18next';
import i18n from 'i18next';

import Button from '../../components/Button/';
import Checkbox from '../../components/Checkbox/';
import TermsModal from '../../components/TermsModal/';
import LanguageSelectModal from '../../components/LanguageSelectModal';
import { name } from '../../config.json';
import { wrapComponent } from '../../utils/i18n';
import { setLocale, fetchNetwork } from '../../reduxContent/settings/thunks';
import {
  getLocale,
  getActivePath
} from '../../reduxContent/settings/selectors';
import { connectLedger } from '../../reduxContent/wallet/thunks';
import {
  getWalletIsLoading,
  getIsLedgerConnecting
} from '../../reduxContent/wallet/selectors';

import { openLink } from '../../utils/general';

import bgHero from '../../../resources/bg-hero/bg-hero.jpg';
import bgCircle01 from '../../../resources/bg-hero/bg-circle_01.png';
import bgCircle02 from '../../../resources/bg-hero/bg-circle_02.png';
import bgCircle03 from '../../../resources/bg-hero/bg-circle_03.png';
import bgCircle04 from '../../../resources/bg-hero/bg-circle_04.png';

import keystoreImg from '../../../resources/imgs/Keystore.svg';
import ledgerUnconnectedImg from '../../../resources/ledger-unconnected.svg';
import ledgerConnectedImg from '../../../resources/ledger-connect.svg';

const SectionContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow-y: hidden;
  overflow-x: hidden;
  margin-top: -90px;
`;

const TermsAndPolicySection = styled.div`
  display: flex;
  width: 80%;
  justify-content: center;
  align-items: center;
  font-weight: 300;
  margin-top: 0 auto 0 10px;
`;

const Strong = styled.span`
  color: ${({ theme: { colors } }) => colors.accent};
  font-weight: 400;
`;

const Link = styled(Strong)`
  cursor: pointer;
`;

const Description = styled.span`
  margin-left: 10px;
`;

const Tip = styled.div`
  width: 76%;
  justify-content: center;
  margin-top: 2%;
  font-size: 14px;
  line-height: 1.5;
  font-weight: 300;
  letter-spacing: 0.6px;
  text-align: left;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const AppName = styled.h1`
  text-align: center;
  width: 100%;
  margin: 0;
  font-family: 'Roboto', san-serif;
  font-style: normal;
  font-stretch: normal;
  font-size: 45px;
  font-weight: 300;
  line-height: 50px;
  letter-spacing: 5px;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const BaseButton = styled(Button)`
  width: 74%;
  height: 9.5%;
  padding: 0;
`;

const CreateWalletButton = styled(BaseButton)`
  margin-top: 8%;
`;

const UnlockWalletButton = styled(BaseButton)`
  margin-top: 5%;
  color: black;
  border-color: black;
  background-color: rgba(255, 255, 255, 0.2);
  &:hover {
    color: #5d4444;
    border-color: #5d4444;
    background-color: rgba(255, 255, 255, 0.5);
  }
`;

const DefaultContainer = styled.div`
  justify-content: center;
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 0px 0px;
`;

const NameSection = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 140px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: row;
  flex: 1;
  width: 100%;
  justify-content: center;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
`;

const BgContainerImg = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  height: 100vh;
  overflow-x: hidden;
  z-index: 0;
  animation: fadeIn 3s forwards;
  animation-delay: 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const BgCircle = styled.img`
  z-index: 1;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  height: 100vh;
  overflow-x: hidden;
  opacity: 0;
  backface-visibility: hidden;
  animation: fadeInOut 2000ms ease-in-out infinite alternate;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translate3d(-50%, 0, 0);
    }
    50% {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
    100% {
      opacity: 1;
      transform: translate3d(-50%, 0, 0);
    }
  }
`;

const BgCircle1 = styled(BgCircle)`
  animation-delay: 2000ms;
`;

const BgCircle2 = styled(BgCircle)`
  animation-delay: 2400ms;
`;

const BgCircle3 = styled(BgCircle)`
  animation-delay: 2800ms;
`;

const BgCircle4 = styled(BgCircle)`
  animation-delay: 3200ms;
`;

const CardContainer = styled.div`
  width: 380px;
  height: 530px;
  border-radius: 5px;
  background-color: ${({ theme: { colors } }) => colors.white};
  box-shadow: 0 2px 4px 0 ${({ theme: { colors } }) => colors.gray13};
  margin: 0 3.5%;
  text-align: center;
  padding: 20px 0 14px 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
`;

const CardImg = styled.img`
  width: 55%;
  height: 41%;
`;

const CardTitle = styled.div`
  font-size: 24px;
  font-weight: 300;
  line-height: 20px;
  margin-top: 5%;
  color: ${({ theme: { colors } }) => colors.primary};
  letter-spacing: 1.7px;
`;

const Linebar = styled.div`
  width: 87%;
  height: 1px;
  background-color: ${({ theme: { colors } }) => colors.gray9};
  opacity: 0.46;
  margin-top: auto;
`;

const LedgerConnect = styled.div`
  font-size: 16px;
  line-height: 21px;
  letter-spacing: 0.7px;
  font-weight: 300;
  width: 288px;
  text-align: left;
  margin-top: 20px;
`;
const DescriptionBold = styled.span`
  font-weight: 400;
`;

const SelectedPath = styled.div`
  margin-top: 2%;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.6px;
  text-align: center;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const LANGUAGE_STORAGE = 'isShowedSelecteLanguageScene';
const AGREEMENT_STORAGE = 'isTezosTermsAndPolicyAgreementAccepted';
class LoginHome extends Component<Props> {
  props: Props;

  state = {
    isAgreement: false,
    isLanguageSelected: false,
    selectedLanguage: 'en-US'
  };

  componentWillMount = () => {
    const { locale } = this.props;
    const languageStorage = localStorage.getItem(LANGUAGE_STORAGE);
    const isLanguageSelected = JSON.parse(languageStorage) || false;
    const agreement = localStorage.getItem(AGREEMENT_STORAGE);
    const isAgreement = JSON.parse(agreement) || false;
    this.setState({
      isAgreement,
      isLanguageSelected,
      selectedLanguage: locale
    });
  };

  componentDidMount = () => {
    const { fetchNetwork } = this.props;
    fetchNetwork();
  };

  updateStatusAgreement = () => {
    const { isAgreement } = this.state;
    this.setState({ isAgreement: !isAgreement });
    return localStorage.setItem(AGREEMENT_STORAGE, !isAgreement);
  };

  onChangeLanguage = lang => {
    this.setState({ selectedLanguage: lang });
    const { setLocale } = this.props;
    setLocale(lang);
    i18n.changeLanguage(lang);
  };

  goToTermsModal = () => {
    const { isLanguageSelected } = this.state;
    localStorage.setItem(LANGUAGE_STORAGE, !isLanguageSelected);
    this.setState({ isLanguageSelected: !isLanguageSelected });
  };

  goToLanguageSelect = () => {
    const { isLanguageSelected } = this.state;
    localStorage.setItem(LANGUAGE_STORAGE, !isLanguageSelected);
    this.setState({ isLanguageSelected: !isLanguageSelected });
  };

  goTo = route => {
    const { match, history } = this.props;
    history.push(`${match.path}/${route}`);
  };

  onLedgerConnect = async () => {
    const { connectLedger } = this.props;
    await connectLedger();
  };

  onDownload = () => {
    const url =
      'https://github.com/Cryptonomic/Deployments/wiki/Galleon:-Tutorials';
    openLink(url);
  };

  openTermsService = () => this.goTo('conditions/termsOfService');

  openPrivacyPolicy = () => this.goTo('conditions/privacyPolicy');

  render() {
    const { t, isLoading, isLedgerConnecting, activePath } = this.props;
    const { isLanguageSelected, isAgreement, selectedLanguage } = this.state;
    const ledgerImg = isLedgerConnecting
      ? ledgerConnectedImg
      : ledgerUnconnectedImg;
    return (
      <SectionContainer>
        <DefaultContainer>
          <NameSection>
            <AppName>{name}</AppName>
          </NameSection>
          <Section>
            <CardContainer>
              <CardImg src={keystoreImg} />
              <CardTitle>{t('containers.loginHome.keystore_wallet')}</CardTitle>
              <CreateWalletButton
                buttonTheme="primary"
                onClick={() => this.goTo('create')}
                disabled={!isAgreement}
              >
                {t('containers.loginHome.create_new_wallet_btn')}
              </CreateWalletButton>
              <UnlockWalletButton
                buttonTheme="secondary"
                onClick={() => this.goTo('import')}
                disabled={!isAgreement}
              >
                {t('containers.loginHome.open_exisiting_wallet_btn')}
              </UnlockWalletButton>
              <Linebar />
              <Tip>
                <div>
                  {t(
                    'containers.loginHome.want_to_import_fundraiser_paper_wallet'
                  )}
                </div>
                <div>
                  <Trans
                    i18nKey="containers.loginHome.create_named_wallet"
                    name={name}
                  >
                    wallet?
                    <Link onClick={() => this.goTo('create')}>
                      <Strong>Create a {name} wallet</Strong>
                    </Link>{' '}
                    first.
                  </Trans>
                </div>
              </Tip>
            </CardContainer>
            <CardContainer>
              <CardImg src={ledgerImg} />

              <CardTitle>{t('containers.loginHome.ledger_wallet')}</CardTitle>
              <CreateWalletButton
                buttonTheme="primary"
                onClick={this.onLedgerConnect}
                disabled={!isAgreement || isLoading}
              >
                {isLedgerConnecting && t('containers.loginHome.connecting')}
                {!isLedgerConnecting &&
                  t('containers.loginHome.connect_ledger')}
              </CreateWalletButton>
              {activePath && (
                <SelectedPath>
                  {t('containers.loginHome.selectedPath')} {activePath}
                </SelectedPath>
              )}
              {isLedgerConnecting && (
                <LedgerConnect>
                  <Trans i18nKey="containers.loginHome.connect_your_device">
                    Please
                    <DescriptionBold> connect your device</DescriptionBold>,
                    <DescriptionBold> enter your pin</DescriptionBold>, and
                    <DescriptionBold> open Tezos Wallet app</DescriptionBold>.
                  </Trans>
                </LedgerConnect>
              )}
              <Linebar />
              <Tip>
                <div>{t('containers.loginHome.dont_have_ledger_wallet')}</div>
                <div>
                  <Link onClick={this.onDownload}>
                    <Strong>
                      {t('containers.loginHome.download_it_here')}
                    </Strong>
                  </Link>
                </div>
              </Tip>
            </CardContainer>
          </Section>
        </DefaultContainer>
        <TermsAndPolicySection>
          <Checkbox
            isChecked={isAgreement}
            onCheck={this.updateStatusAgreement}
          />
          <Description>
            <Trans i18nKey="containers.loginHome.description">
              I acknowledge that I have read and accepted the
              <Link onClick={this.openTermsService}> Terms of Service </Link>
              and
              <Link onClick={this.openPrivacyPolicy}> Privacy Policy</Link>
            </Trans>
          </Description>
        </TermsAndPolicySection>
        <LanguageSelectModal
          isOpen={!isLanguageSelected}
          onLanguageChange={this.onChangeLanguage}
          selectedLanguage={selectedLanguage}
          onContinue={this.goToTermsModal}
        />
        <TermsModal
          goTo={this.goTo}
          isOpen={!isAgreement && isLanguageSelected}
          agreeTermsAndPolicy={this.updateStatusAgreement}
          onBack={this.goToLanguageSelect}
        />
        <Background>
          <BgContainerImg src={bgHero} />
          <BgCircle1 src={bgCircle01} />
          <BgCircle2 src={bgCircle02} />
          <BgCircle3 src={bgCircle03} />
          <BgCircle4 src={bgCircle04} />
        </Background>
      </SectionContainer>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: getLocale(state),
    isLoading: getWalletIsLoading(state),
    isLedgerConnecting: getIsLedgerConnecting(state),
    activePath: getActivePath(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocale,
      connectLedger,
      fetchNetwork
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
)(LoginHome);
