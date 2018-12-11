// @flow
import React from 'react';
import styled from 'styled-components';
import Modal from '../CustomModal';
import Button from './../Button/';
import TezosIcon from '../TezosIcon/';
import { ms } from '../../styles/helpers';
import TezosAddress from '../TezosAddress/';
import Fees from '../Fees/';
import Loader from '../Loader';
import PasswordInput from '../PasswordInput';
import InputAddress from '../InputAddress/';
import { wrapComponent } from '../../utils/i18n';

const ModalContainer = styled.div`
  padding: 43px 76px 0 76px;
`;
const DelegateTitle = styled.div`
  color: ${({ theme: { colors } }) => colors.gray5};
  font-size: 16px;
  letter-spacing: 0.7px;
`;
const AddressContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.light};
  height: 53px;
  width: 100%;
  display: flex;
  align-items: center;
  padding-left: 21px;
  margin-top: 10px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 42px;
  padding: 0 76px 15px 76px;
  background-color: ${({ theme: { colors } }) => colors.gray1};
  height: 100px;
`;
const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
  margin-left: auto;
  padding: 0;
`;

const WarningContainer = styled.div`
  height: 91px;
  width: 100%;
  border: solid 1px rgba(148, 169, 209, 0.49);
  border-radius: 3px;
  background-color: ${({ theme: { colors } }) => colors.light};
  display: flex;
  align-items: center;
  padding: 0 19px;
  margin-top: 36px;
`;
const InfoText = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 16px;
  letter-spacing: 0.7px;
  margin-left: 11px;
  line-height: 21px;
`;

const FeesContainer = styled.div`
  margin-top: 19px;
`;

const InputAddressContainer = styled.div`
  margin-top: 19px;
`;

type Props = {
  onEnterPress: () => {},
  open?: boolean,
  address: string,
  newAddress?: string,
  password?: string,
  fee?: number,
  miniFee?: number,
  averageFees: object,
  handleFeeChange: () => {},
  handlePasswordChange: () => {},
  onAddressChange: () => {},
  onDelegate: () => {},
  onCloseClick: () => {},
  isLoading?: boolean,
  isShowedPwd: boolean,
  onShowPwd: () => {},
  isDelegateIssue: boolean,
  onDelegateIssue: () => {},
  isLedger: boolean,
  t: () => {}
};

const DelegateConfirmationModal = (props: Props) => {
  const {
    onEnterPress,
    open,
    address,
    newAddress,
    password,
    fee,
    miniFee,
    averageFees,
    handleFeeChange,
    handlePasswordChange,
    onAddressChange,
    onDelegate,
    onCloseClick,
    isLoading,
    isShowedPwd,
    onShowPwd,
    isDelegateIssue,
    onDelegateIssue,
    isLedger,
    t
  } = props;
  const isDisabled =
    isLoading || !newAddress || (!password && !isLedger) || isDelegateIssue;

  return (
    <Modal
      title={t('components.delegate.change_delegate')}
      open={open}
      onClose={onCloseClick}
      style={{ width: '651px' }}
      onKeyDown={onEnterPress}
    >
      <ModalContainer>
        <DelegateTitle>
          {t('components.delegate.current_delegate')}
        </DelegateTitle>
        <AddressContainer>
          <TezosAddress
            address={address}
            size="16px"
            color="primary"
            color2="index0"
          />
        </AddressContainer>
        <InputAddressContainer>
          <InputAddress
            labelText={t(
              'components.delegateConfirmationModal.new_address_label'
            )}
            addressType="delegate"
            tooltip={false}
            changeDelegate={onAddressChange}
            onIssue={onDelegateIssue}
          />
        </InputAddressContainer>
        <FeesContainer>
          <Fees
            low={averageFees.low}
            medium={averageFees.medium}
            high={averageFees.high}
            fee={fee}
            miniFee={miniFee}
            onChange={handleFeeChange}
          />
        </FeesContainer>
        <WarningContainer>
          <TezosIcon iconName="info" size={ms(5)} color="info" />
          <InfoText>
            {t('components.delegateConfirmationModal.delegate_warning')}
          </InfoText>
        </WarningContainer>
      </ModalContainer>
      <BottomContainer>
        {!isLedger && (
          <PasswordInput
            label={t('general.nouns.wallet_password')}
            isShowed={isShowedPwd}
            password={password}
            changFunc={handlePasswordChange}
            onShow={onShowPwd}
            containerStyle={{ width: '60%', marginTop: '10px' }}
          />
        )}
        <DelegateButton
          buttonTheme="primary"
          disabled={isDisabled}
          small
          onClick={onDelegate}
        >
          {t('components.delegate.change_delegate')}
        </DelegateButton>
      </BottomContainer>
      {isLoading && <Loader />}
    </Modal>
  );
};
DelegateConfirmationModal.defaultProps = {
  open: false,
  newAddress: '',
  fee: 100,
  password: '',
  isLoading: false
};
export default wrapComponent(DelegateConfirmationModal);
