// @flow
import React from 'react';
import { Trans } from 'react-i18next';
import styled from 'styled-components';
import Modal from '../CustomModal';
import Loader from '../Loader';
import TezosAddress from '../TezosAddress';
import TezosIcon from '../TezosIcon';
import sendImg from '../../../resources/imgs/Send.svg';
import confirmImg from '../../../resources/imgs/Confirm-Ledger.svg';
import { wrapComponent } from '../../utils/i18n';
import { formatAmount } from '../../utils/currancy';

const MainContainer = styled.div`
  padding: 13px 76px 0 76px;
`;

const DescriptionContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 23px;
`;

const SendSvg = styled.img`
  width: 47px;
  height: 47px;
  flex: none;
`;

const SendDes = styled.div`
  margin-left: 16px;
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  letter-spacing: 0.9px;
  color: ${({ theme: { colors } }) => colors.black};
`;

const ItemContainer = styled.div`
  width: 100%;
  height: 57px;
  border-bottom: solid 1px rgba(148, 169, 209, 0.27);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 27px;
  height: 124px;
  padding: 0 76px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const ConfirmImg = styled.img`
  width: 283px;
  height: 84px;
  display: block;
`;

const ConfirmDes = styled.div`
  font-size: 14px;
  font-weight: 300;
  width: 198px;
  margin: auto 0;
  color: ${({ theme: { colors } }) => colors.gray3};
`;

const ConfirmSpan = styled.span`
  font-weight: 300;
  color: ${({ theme: { colors } }) => colors.blue4};
`;

const ItemTitle = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.38);
  line-height: 18px;
  display: flex;
  align-items: flex-end;
`;

const ItemContent = styled.div`
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme: { colors } }) => colors.primary};
  font-weight: 300;
  display: flex;
  align-items: center;
`;

type Props = {
  address?: string,
  source?: string,
  open?: boolean,
  onCloseClick?: () => {},
  isLoading?: boolean,
  fee: number,
  amount: string,
  parameters: string,
  t: () => {}
};

const InvokeLedgerConfirmationModal = (props: Props) => {
  const {
    address,
    source,
    open,
    isLoading,
    onCloseClick,
    fee,
    amount,
    parameters,
    t
  } = props;

  const calcFee = formatAmount(fee);

  return (
    <Modal
      title={t('components.invokeLedgerConfirmationModal.confirm_invoke_title')}
      open={open}
      onClose={onCloseClick}
      style={{ width: '671px' }}
    >
      <MainContainer>
        <DescriptionContainer>
          <SendSvg src={sendImg} />
          <SendDes>
            {t('components.invokeLedgerConfirmationModal.invoke_description')}
          </SendDes>
        </DescriptionContainer>

        <ItemContainer>
          <ItemTitle>{t('components.interactModal.invoke_from')}</ItemTitle>
          <TezosAddress
            address={source}
            size="16px"
            weight={300}
            color="primary"
          />
        </ItemContainer>

        <ItemContainer>
          <ItemTitle>{t('general.nouns.smart_contract')}</ItemTitle>
          <TezosAddress
            address={address}
            size="16px"
            weight={300}
            color="primary"
          />
        </ItemContainer>

        <ItemContainer>
          <ItemTitle>{t('components.interactModal.parameters')}</ItemTitle>
          <ItemContent>{parameters}</ItemContent>
        </ItemContainer>

        <ItemContainer>
          <ItemTitle>{t('general.nouns.fee')}</ItemTitle>
          <ItemContent>
            {calcFee}
            <TezosIcon color="secondary" iconName="tezos" />
          </ItemContent>
        </ItemContainer>

        <ItemContainer>
          <ItemTitle>{t('general.nouns.amount')}</ItemTitle>
          <ItemContent>
            {amount}
            <TezosIcon color="secondary" iconName="tezos" />
          </ItemContent>
        </ItemContainer>
      </MainContainer>
      <BottomContainer>
        <ConfirmDes>
          <Trans i18nKey="components.delegationLedgerConfirmationModal.confirm_description">
            If the all the details are correct, please
            <ConfirmSpan>confirm</ConfirmSpan> the origination on your device.
          </Trans>
        </ConfirmDes>
        <ConfirmImg src={confirmImg} />
      </BottomContainer>
      {isLoading && <Loader />}
    </Modal>
  );
};

export default wrapComponent(InvokeLedgerConfirmationModal);
