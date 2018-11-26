// @flow
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import Modal from '../CustomModal';
import Loader from '../Loader';
import confirmImg from '../../../resources/imgs/Confirm-Ledger.svg';
import { wrapComponent } from '../../utils/i18n';

const MainContainer = styled.div`
  padding: 13px 58px 58px 58px;
`;

const ConfirmImg = styled.img`
  width: 283px;
  height: 84px;
  display: block;
  margin: 0 auto;
`;

const ListHeader = styled.div`
  font-size: 14px;
  line-height: 28px;
  letter-spacing: 0.58px;
  font-weight: 300;
`;

const ListItem = styled.div`
  font-size: 14px;
  line-height: 21px;
  letter-spacing: 0.58px;
  font-weight: 300;
`;
const ListNumber = styled.span`
  font-size: 14px;
  font-weight: 400;
`;

const NotApp = styled.span`
  color: ${({ theme: { colors } }) => colors.gray5};
`;

const Link = styled.span`
  color: ${({ theme: { colors } }) => colors.accent};
  font-weight: 400;
  cursor: pointer;
`;

type Props = {
  open?: boolean,
  onCloseClick?: () => {},
  isLoading?: boolean,
  t: () => {}
};

const ConnectingLedgerModal = (props: Props) => {
  const { open, isLoading, onCloseClick, t } = props;

  return (
    <Modal
      title={t('components.connectingLedgerModal.connecting_ledger')}
      open={open}
      onClose={onCloseClick}
      style={{ width: '568px', minWidth: '568px' }}
    >
      <MainContainer>
        <ConfirmImg src={confirmImg} />
        <ListHeader>
          {t('components.connectingLedgerModal.to_access_ledger')}
        </ListHeader>
        <ListItem>
          <ListNumber>1.</ListNumber>
          {t('components.connectingLedgerModal.connect_your_device')}
        </ListItem>
        <ListItem>
          <ListNumber>2.</ListNumber>
          {t('components.connectingLedgerModal.enter_pin')}
        </ListItem>
        <ListItem>
          <ListNumber>3.</ListNumber>
          <Trans i18nKey="components.connectingLedgerModal.open_wallet">
            Open Tezos Wallet App.
            <NotApp>
              (Don’t have the app?
              <Link>Get it here.</Link>)
            </NotApp>
          </Trans>
        </ListItem>
        <ListItem>
          <ListNumber>4.</ListNumber>
          {t('components.connectingLedgerModal.provide_key')}
        </ListItem>
      </MainContainer>
      {isLoading && <Loader />}
    </Modal>
  );
};

export default wrapComponent(ConnectingLedgerModal);
