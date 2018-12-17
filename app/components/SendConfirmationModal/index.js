// @flow
import React from 'react';
import styled from 'styled-components';
import Modal from '../CustomModal';
import Loader from '../Loader';
import Button from '../Button';
import TezosAddress from '../TezosAddress';
import TezosIcon from '../TezosIcon';
import PasswordInput from '../PasswordInput';
import sendImg from '../../../resources/imgs/Send.svg';
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

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  height: 98px;
  padding: 0 76px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const ConfirmButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-top: 23px;
  font-weight: 300;
  padding: 0;
`;

type Props = {
  onEnterPress: () => {},
  amount: ?string,
  password?: string,
  address?: string,
  open?: boolean,
  onCloseClick?: () => {},
  onPasswordChange?: () => {},
  onSend?: () => {},
  isLoading?: boolean,
  isShowedPwd?: boolean,
  onShowPwd: () => {},
  source?: string,
  fee: number,
  isDisplayedBurn?: boolean,
  t: () => {}
};

const SendConfirmationModal = (props: Props) => {
  const {
    onEnterPress,
    amount,
    address,
    open,
    isLoading,
    onPasswordChange,
    password,
    onCloseClick,
    onSend,
    isShowedPwd,
    onShowPwd,
    source,
    fee,
    isDisplayedBurn,
    t
  } = props;

  const isDisabled = isLoading || !password;

  const calcFee = formatAmount(fee);

  return (
    <Modal
      title={t('components.sendConfirmationModal.send_confirmation')}
      open={open}
      onClose={onCloseClick}
      onKeyDown={onEnterPress}
      style={{ width: '671px' }}
    >
      <MainContainer>
        <DescriptionContainer>
          <SendSvg src={sendImg} />
          <SendDes>
            {t('components.sendConfirmationModal.send_description')}
          </SendDes>
        </DescriptionContainer>

        <ItemContainer>
          <ItemTitle>{t('general.nouns.amount')}</ItemTitle>
          <ItemContent>
            {amount}
            <TezosIcon color="secondary" iconName="tezos" />
          </ItemContent>
        </ItemContainer>

        <ItemContainer>
          <ItemTitle>{t('general.nouns.fee')}</ItemTitle>
          <ItemContent>
            {calcFee}
            <TezosIcon color="secondary" iconName="tezos" />
          </ItemContent>
        </ItemContainer>

        {isDisplayedBurn && (
          <ItemContainer>
            <ItemTitle>{t('general.nouns.burn')}</ItemTitle>
            <ItemContent>
              0.257
              <TezosIcon color="secondary" iconName="tezos" />
            </ItemContent>
          </ItemContainer>
        )}

        <ItemContainer>
          <ItemTitle>{t('general.nouns.source')}</ItemTitle>
          <TezosAddress
            address={source}
            size="16px"
            weight={300}
            color="primary"
          />
        </ItemContainer>

        <ItemContainer>
          <ItemTitle>{t('general.nouns.destination')}</ItemTitle>
          <TezosAddress
            address={address}
            size="16px"
            weight={300}
            color="primary"
          />
        </ItemContainer>
      </MainContainer>

      <BottomContainer>
        <PasswordInput
          label={t('general.nouns.wallet_password')}
          isShowed={isShowedPwd}
          password={password}
          changFunc={onPasswordChange}
          onShow={onShowPwd}
          containerStyle={{ width: '55%', marginTop: '15px' }}
        />
        <ConfirmButton
          buttonTheme="primary"
          disabled={isDisabled}
          onClick={onSend}
        >
          {t('general.verbs.confirm')}
        </ConfirmButton>
      </BottomContainer>
      {isLoading && <Loader />}
    </Modal>
  );
};

export default wrapComponent(SendConfirmationModal);
