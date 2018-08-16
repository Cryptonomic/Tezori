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
`;
const DelegateButton = styled(Button)`
  width: 194px;
  height: 50px;
  margin-bottom: 10px;
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

type Props = {
  open?: boolean,
  address: string,
  newAddress?: string,
  password?: string,
  fee?: number,
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
  onDelegateIssue: () => {}
};

const DelegateConfirmationModal = (props: Props) => {
  const {
    open,
    address,
    newAddress,
    password,
    fee,
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
    onDelegateIssue
  } = props;
  const isDisabled = isLoading || !newAddress || !password || isDelegateIssue;

  return (
    <Modal
      title='Change Delegate'
      open={open}
      onClose={onCloseClick}
    >
      <ModalContainer>
        <DelegateTitle>You are currently delegating to</DelegateTitle>
        <AddressContainer>
          <TezosAddress
            address={address}
            size="16px"
            color="primary"
            color2="index0"
          />
        </AddressContainer>
        <InputAddress
          labelText='Change Delegate to New Address' 
          addressType="delegate"
          tooltip={false}
          changeDelegate={onAddressChange}
          onIssue={onDelegateIssue}
        />
        <Fees
          low={averageFees.low}
          medium={averageFees.medium}
          high={averageFees.high}
          fee={fee}
          onChange={handleFeeChange}
        />
        <WarningContainer>
          <TezosIcon iconName="info" size={ms(5)} color="info" />
          <InfoText>
            Your delegation change will not show up until the change is
            confirmed on the blockchain.
          </InfoText>
        </WarningContainer>
      </ModalContainer>
      <BottomContainer>
        <PasswordInput
          label='Wallet Password'
          isShowed={isShowedPwd}
          password={password}
          changFunc={handlePasswordChange}
          onShow={onShowPwd}
          containerStyle={{width: '60%', marginTop: '10px'}}
        />
        <DelegateButton
          buttonTheme="primary"
          disabled={isDisabled}
          small
          onClick={onDelegate}
        >
          Change Delegate
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
export default DelegateConfirmationModal;
