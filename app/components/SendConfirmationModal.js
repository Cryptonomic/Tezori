// @flow
import React from 'react';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import styled from 'styled-components';
import { ms } from '../styles/helpers';

import { H5 } from './Heading';
import tezosLogo from '../../resources/tezosLogo.png';
import Loader from './Loader';
import Button from './Button';

import styles from './SendConfirmationModal.css';

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

const TezosSymbol = styled.img`
  height: 17px;
  width: 17px;
  filter: brightness(0%);
  opacity: 0.5;
`;

const Heading = styled(H5)`
  margin-bottom: 20px;
  color: ${({ theme: { colors } }) => colors.primary};
`;

type Props = {
  amount?: string,
  address?: string,
  open?: boolean,
  isLoading?: boolean,
  updatePassword?: Function,
  password?: string,
  onCloseClick?: Function,
  sendConfirmation?: Function
};

const SendConfirmationModal = props => {
  const {
    amount,
    address,
    open,
    isLoading,
    updatePassword,
    password,
    onCloseClick,
    sendConfirmation
  } = props;

  const onClose = () => {
    updatePassword('');
    onCloseClick();
  };

  return (
    <Dialog
      modal
      open={open}
      title="Send Confirmation"
      bodyStyle={{ padding: '50px' }}
      titleStyle={{ padding: '50px 50px 0px' }}
    >
      <CloseIcon
        className={styles.closeIcon}
        style={{ fill: '#7190C6' }}
        onClick={onClose}
      />
      <Heading>Do you confirm that you want to send</Heading>
      <AmountContainer>
        <DataToSend>
          {amount}
          <TezosSymbol src={tezosLogo} />
        </DataToSend>
        <Connector>to</Connector>
        <DataToSend>{address}</DataToSend>
      </AmountContainer>
      <PaswordContainer>
        <TextField
          floatingLabelText="Enter Password"
          style={{ width: '60%' }}
          type="password"
          value={password}
          onChange={(_, newPassword) => updatePassword(newPassword)}
        />
        <Button
          buttonTheme="secondary"
          onClick={sendConfirmation}
          disabled={isLoading}
        >
          Confirm
        </Button>
      </PaswordContainer>
      {isLoading && <Loader />}
    </Dialog>
  );
};

export default SendConfirmationModal;
