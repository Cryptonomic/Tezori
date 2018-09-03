import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { Trans } from 'react-i18next';
import Button from '../Button';
import BackButton from "../BackButton";
import { name } from '../../config.json';
import { wrapComponent } from '../../utils/i18n';
import termsLogoIcon from '../../../resources/imgs/ToS_PP_icon.svg';


const Container = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  width: 508px;
  padding: 36px 0;
`;

const Title = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.normal};
  font-size: 36px;
  line-height: 40px;
  letter-spacing: 0.1px;
`;

const TermsLogo = styled.img`
  width: 197px;
  height: 197px;
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 32px 0 75px 0;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Description = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: 300;
  flex: 1;
  font-size: 18px;
  line-height: 26px;
  letter-spacing: 0.1px;
  margin-top: 22px;
`;

const Link = styled.span`
  color: ${({ theme: { colors } }) => colors.accent};
  cursor: pointer;
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.normal};
`;

const AgreeButton = styled(Button)`
  width: 194px;
  height: 50px;
  padding: 0;
`;

const customStyles = {
  content: {
    alignItems: 'center',
    border: '0',
    borderRadius: '0',
    top: 'auto',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    width: '100%'
  },
  overlay: {
    backgroundColor: 'rgba(155, 155, 155, 0.68)'
  }
};

type Props = {
  isOpen: boolean,
  goTo: () => {},
  agreeTermsAndPolicy: () => {},
  onBack: () => {},
  t: () => {}
};

const TermsModal = (props: Props) => {
  const { goTo, isOpen, agreeTermsAndPolicy, onBack, t } = props;

  const openTermsService = () => goTo('conditions/termsOfService');
  const openPrivacyPolicy = () => goTo('conditions/privacyPolicy');

  return (
    <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
      <Container>
        <Title>{t("components.termsModal.welcome_to", {name})}</Title>
        <MainContainer>
          <TermsLogo src={termsLogoIcon} />     
          <Description>
            <Trans i18nKey="components.termsModal.description">
              Before we get started, please read our
              <Link onClick={openTermsService}> Terms of Service </Link>
              and
              <Link onClick={openPrivacyPolicy}> Privacy Policy</Link>
            </Trans>
          </Description>
        </MainContainer>
        <BottomContainer>
          <BackButton onClick={onBack} />
          <AgreeButton buttonTheme="primary" onClick={agreeTermsAndPolicy}>
            {t("components.termsModal.i_agree")}
          </AgreeButton>
        </BottomContainer>
      </Container>
    </Modal>
  );
};

export default wrapComponent(TermsModal);
