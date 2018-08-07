// @flow
import React from 'react';
import { Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';

import styled from 'styled-components';
import Button from './../Button/';
import TezosIcon from '../TezosIcon/';
import { ms } from '../../styles/helpers';
import TezosAddress from '../TezosAddress/';
import Fees from '../Fees/';
import Loader from '../Loader';
import PasswordInput from '../PasswordInput';
import InputAddress from '../InputAddress/';

const inputStyles = {
  underlineFocusStyle: {
    borderColor: '#2c7df7'
  },
  underlineStyle: {
    borderColor: '#d0d2d8'
  },
  errorUnderlineStyle: {
    borderColor: '#ea776c'
  },
  floatingLabelStyle: {
    color: 'rgba(0, 0, 0, 0.38)'
  },
  floatingLabelFocusStyle: {
    color: '#5571a7'
  }
};
const ModalDialog = styled(Dialog)`
  padding-top: 0px !important;
  & > div > div > div > div {
    max-height: none !important;
  }
`;

const ModalContainer = styled.div`
  padding: 0 98px 43px 98px;
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
  width: 100%;
  height: 98px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 98px;
  background-color: ${({ theme: { colors } }) => colors.light};
`;
const DelegateButton = styled(Button)`
  height: 50px;
  width: 194px;
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
const StyledCloseIcon = styled(CloseIcon)`
  cursor: pointer;
  position: absolute;
  top: 47px;
  right: 66px;
  fill: #7190c6 !important;
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
    <ModalDialog
      modal
      open={open}
      title="Change Delegate"
      bodyStyle={{ padding: '0' }}
      contentStyle={{ width: '671px', maxHeight: 'none' }}
      titleStyle={{
        padding: '43px 98px 21px 98px',
        fontSize: '24px',
        color: '#123262',
        letterSpacing: '1px',
        lineHeight: '42px'
      }}
    >
      <ModalContainer>
        <StyledCloseIcon onClick={onCloseClick} />
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
          address={newAddress}
          labelText='Change Delegate to New Address' 
          addressType="delegate"
          tooltip={false}
          changeDelegate={onAddressChange}
          onIssue={onDelegateIssue}
        />
        <Fees
          styles={{ minWidth: 206, width: 'auto' }}
          underlineStyle={inputStyles.underlineStyle}
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
          containerStyle={{marginTop: '-27px', width: '50%'}}
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
    </ModalDialog>
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
