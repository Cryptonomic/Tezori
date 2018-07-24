import React from 'react';
import styled from 'styled-components';
import Modal from 'react-modal';
import { H2 } from '../Heading';
import Button from '../Button';
import { ms } from '../../styles/helpers';

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
  goTo: Function,
  agreeTermsAndPolicy: Function
};

const TermsModal = (props: Props) => {
  const { goTo, isOpen, agreeTermsAndPolicy } = props;

  const openTermsService = () => goTo('conditions/termsOfService');
  const openPrivacyPolicy = () => goTo('conditions/privacyPolicy');

  return (
    <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
      <Container>
        <Title>Hi there!</Title>
        <Description>
          Before we get started, please read and accept our
          <Link onClick={openTermsService}> Terms of Service </Link>
          and
          <Link onClick={openPrivacyPolicy}> Privacy Policy </Link>
        </Description>
        <Button buttonTheme="primary" onClick={agreeTermsAndPolicy}>
          I agree
        </Button>
      </Container>
    </Modal>
  );
};

export default TermsModal;
