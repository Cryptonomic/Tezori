// @flow
import React from 'react';
import { Dialog } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import styled from 'styled-components';
import { ms } from '../../styles/helpers';

import { H5 } from '../Heading';
import Loader from '../Loader';
import Button from '../Button';
import TezosIcon from '../TezosIcon';
import PasswordInput from '../PasswordInput';

const AmountContainer = styled.div`
  marginbottom: ${ms(4)};
`;

const DataToSend = styled.span`
  border-bottom: 1px solid #7b91c0;
  color: ${({ theme: { colors } }) => colors.secondary};
  margin: 0;
  font-size: 20px;
  display: inline-block;
`;

const Connector = styled.span`
  margin: 0 ${ms(0)};
`;

const PaswordContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const Heading = styled(H5)`
  margin-bottom: 20px;
  color: ${({ theme: { colors } }) => colors.primary};
`;

type Props = {
  amount?: string,
  password?: string,
  address?: string,
  open?: boolean,
  onCloseClick?: () => {},
  onPasswordChange?: () => {},
  onSend?: () => {},
  isLoading?: boolean,
  isShowedPwd?: boolean,
  onShowPwd: () => {}
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
    onShowPwd
  } = props;

  return (
    <Dialog
      modal
      open={open}
      title="Send Confirmation"
      bodyStyle={{ padding: '50px' }}
      titleStyle={{ padding: '50px 50px 0px' }}
    >
      <CloseIcon
        style={{
          fill: '#7190C6',
          cursor: 'pointer',
          height: '20px',
          width: '20px',
          position: 'absolute',
          top: '10px',
          right: '15px'
        }}
        onClick={onCloseClick}
      />
      <Heading>Do you confirm that you want to send</Heading>
      <AmountContainer>
        <DataToSend>
          {amount}
          <TezosIcon color="secondary" iconName="tezos" />
        </DataToSend>
        <Connector>to</Connector>
        <DataToSend>{address}</DataToSend>
      </AmountContainer>
      <PaswordContainer>
        <PasswordInput
          label='Wallet Password'
          isShowed={isShowedPwd}
          password={password}
          changFunc={onPasswordChange}
          onShow={onShowPwd}
          containerStyle={{width: '70%'}}
        />
        <Button buttonTheme="secondary" onClick={onSend} disabled={isLoading}>
          Confirm
        </Button>
      </PaswordContainer>
      {isLoading && <Loader />}
    </Dialog>
  );
};

export default SendConfirmationModal;
