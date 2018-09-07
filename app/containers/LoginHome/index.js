// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { bindActionCreators, compose } from 'redux';
import { Trans } from 'react-i18next';
import i18n from 'i18next';

import { ms } from '../../styles/helpers';
import Button from '../../components/Button/';
import Checkbox from '../../components/Checkbox/';
import TermsModal from '../../components/TermsModal/';
import LanguageSelectModal from '../../components/LanguageSelectModal';
import LanguageSelector from '../../components/LanguageSelector/';
import { name, tagline } from '../../config.json';
import { wrapComponent } from '../../utils/i18n';
import { setLocale } from '../../reduxContent/settings/thunks';
import { getLocale } from '../../reduxContent/settings/selectors';

import bgHero from '../../../resources/bg-hero/bg-hero.jpg';
import bgCircle01 from '../../../resources/bg-hero/bg-circle_01.png';
import bgCircle02 from '../../../resources/bg-hero/bg-circle_02.png';
import bgCircle03 from '../../../resources/bg-hero/bg-circle_03.png';
import bgCircle04 from '../../../resources/bg-hero/bg-circle_04.png';

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
  border-top-color: ${({ theme: { colors } }) => colors.index1};
  border-top-style: solid;
  justify-content: center;
  align-items: center;
  font-weight: 300;
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
  font-size: 6rem;
  font-weight: 300;
  line-height: normal;
  letter-spacing: 0.5rem;
  margin: 0 auto;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const AppSubtitle = styled.h2`
  text-align: center;
  width: 100%;
  font-family: 'Roboto', san-serif;
  font-style: normal;
  font-stretch: normal;
  font-size: 1.2rem;
  font-weight: 300;
  line-height: 1.2rem;
  letter-spacing: 0.25rem;
  margin: 0 auto 2.5rem;
  color: ${({ theme: { colors } }) => colors.primary};
`;

const CreateWalletButton = styled(Button)`
  min-width: 22rem;
  width: 100%;
`;

const UnlockWalletButton = styled(Button)`
  min-width: 22rem;
  width: 100%;
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
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  padding: 0px 50px;
`;

const WalletContainers = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 30px;
  justify-content: stretch;
`;

const Section = styled.section`
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
`;

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  overflow-x: hidden;
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
    this.setState({ isAgreement, isLanguageSelected, selectedLanguage: locale });
  };

  updateStatusAgreement = () => {
    const { isAgreement } = this.state;
    this.setState({ isAgreement: !isAgreement });
    return localStorage.setItem(AGREEMENT_STORAGE, !isAgreement);
  };

  onChangeLanguage = (lang) => {
    this.setState({ selectedLanguage: lang });
    const { setLocale } = this.props;
    setLocale(lang);
    i18n.changeLanguage(lang);
  }

  goToTermsModal  = () => {
    const { isLanguageSelected } = this.state;
    localStorage.setItem(LANGUAGE_STORAGE, !isLanguageSelected);
    this.setState({ isLanguageSelected: !isLanguageSelected });    
  }

  goToLanguageSelect = () => {
    const { isLanguageSelected } = this.state;
    localStorage.setItem(LANGUAGE_STORAGE, !isLanguageSelected);
    this.setState({ isLanguageSelected: !isLanguageSelected });
  }

  goTo = route => {
    const { match, history } = this.props;
    history.push(`${match.path}/${route}`);
  };

  openTermsService = () => this.goTo('conditions/termsOfService');
  openPrivacyPolicy = () => this.goTo('conditions/privacyPolicy');

  render() {
    const { t, locale, setLocale } = this.props;
    const { isLanguageSelected, isAgreement, selectedLanguage } = this.state;
    return (
      <SectionContainer>
        <DefaultContainer>
          <Section>
            <AppName>{name}</AppName>
            <AppSubtitle>{t(tagline)}</AppSubtitle>
          </Section>
          <Section>
            <WalletContainers>
              <CreateWalletButton
                buttonTheme="primary"
                onClick={() => this.goTo('create')}
                disabled={!isAgreement}
              >
                {t('containers.loginHome.create_new_wallet_btn')}
              </CreateWalletButton>
            </WalletContainers>
            <WalletContainers>
              <UnlockWalletButton
                buttonTheme="secondary"
                onClick={() => this.goTo('import')}
                disabled={!isAgreement}
              >
                {t('containers.loginHome.open_exisiting_wallet_btn')}
              </UnlockWalletButton>
              <LanguageSelector locale={locale} setLocale={setLocale} />
              <Tip>
                <div>{t('containers.loginHome.want_to_import_fundraiser_paper_wallet')}</div>
                <div>
                  <Trans i18nKey="containers.loginHome.create_named_wallet" name={name}>
                    <Link onClick={() => this.goTo('create')}>
                      <Strong>Create a {name} wallet</Strong>
                    </Link> first.                    
                  </Trans>
                </div>
              </Tip>
            </WalletContainers>
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
    locale: getLocale(state)
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setLocale
    },
    dispatch
  );
}

export default compose(wrapComponent, connect(mapStateToProps, mapDispatchToProps))(LoginHome);
