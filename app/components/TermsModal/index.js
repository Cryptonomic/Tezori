import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { Trans } from 'react-i18next';
import { H2 } from '../Heading';
import Button from '../Button';
import { ms } from '../../styles/helpers';
import { wrapComponent } from '../../utils/i18n';

const Container = styled.div`
  background-color: ${({ theme: { colors } }) => colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled(H2)`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.normal};
`;

const Description = styled.p`
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.light};
  margin-bottom: ${ms(5)};
  margin-top: 0.6rem;
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
const customStyles = {
  content: {
    alignItems: 'center',
    border: '0',
    borderRadius: '0',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    top: '57%',
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
  t: () => {}
};

const TermsModal = (props: Props) => {
  const { goTo, isOpen, agreeTermsAndPolicy, t } = props;

  const openTermsService = () => goTo('conditions/termsOfService');
  const openPrivacyPolicy = () => goTo('conditions/privacyPolicy');

  return (
    <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
      <Container>
        <Title>{t("components.termsModal.hi_there")}</Title>
        <Description>
          <Trans i18nKey="components.termsModal.description">
            Before we get started, please read and accept our
            <Link onClick={openTermsService}> Terms of Service </Link>
            and
            <Link onClick={openPrivacyPolicy}> Privacy Policy</Link>
          </Trans>
        </Description>
        <Button buttonTheme="primary" onClick={agreeTermsAndPolicy}>
          {t("components.termsModal.i_agree")}
        </Button>
      </Container>
    </Modal>
  );
};

export default wrapComponent(TermsModal);
