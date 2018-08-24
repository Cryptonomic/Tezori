// @flow
import React from 'react';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';
import Modal from '../CustomModal';
import Loader from '../Loader';
import Button from '../Button';
import TezosIcon from '../TezosIcon';
import PasswordInput from '../PasswordInput';
import { wrapComponent } from '../../utils/i18n';

const AmountContainer = styled.div`
  margin-bottom: ${ms(4)};
  display: flex;
  align-items: baseline;
`;

const DataToSend = styled.span`
  border-bottom: 1px solid #7b91c0;
  color: ${({ theme: { colors } }) => colors.secondary};
  margin: 0;
  font-size: 19px;
  display: flex;
  align-items: center;
  font-weight: 300;
`;

const Connector = styled.span`
  margin: 0 ${ms(-1)};
  font-weight: 300;
`;

const PaswordContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 42px;
  padding: 0 76px 15px 76px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
`;

const ConfirmButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  font-weight: 300;
  padding: 0;
`;

const ConfirmTitle = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  color: ${({ theme: { colors } }) => colors.gray0};
`;

const MainContainer = styled.div`
  padding: 56px 76px 0 76px;
`;

type Props = {
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
  t: () => {}
};

const SendConfirmationModal = (props: Props) => {
  const {
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
    t
  } = props;

  const isDisabled = isLoading || !password;

  return (
    <Modal
      title={t('components.sendConfirmationModal.send_confirmation')}
      open={open}
      onClose={onCloseClick}
    >
      <MainContainer>
        <ConfirmTitle>{t('components.sendConfirmationModal.confirm_question')}</ConfirmTitle>
        <AmountContainer>
          <DataToSend>
            {amount}
            <TezosIcon color="secondary" iconName="tezos" />
          </DataToSend>
          <Connector>{t('general.to')}</Connector>
          <DataToSend>{address}</DataToSend>
        </AmountContainer>
      </MainContainer>
      <PaswordContainer>
        <PasswordInput
          label={t('general.nouns.wallet_password')}
          isShowed={isShowedPwd}
          password={password}
          changFunc={onPasswordChange}
          onShow={onShowPwd}
          containerStyle={{width: '60%', marginTop: '10px'}}
        />
        <ConfirmButton
          buttonTheme="primary"
          disabled={isDisabled}
          onClick={onSend}
        >
          {t('general.verbs.confirm')}
        </ConfirmButton>
      </PaswordContainer>
      {isLoading && <Loader />}
    </Modal>
  );
};

export default wrapComponent(SendConfirmationModal);
