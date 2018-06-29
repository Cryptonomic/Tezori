import React, { Fragment } from 'react';
import { Dialog, TextField } from 'material-ui';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import classNames from 'classnames';
import styled from 'styled-components'
import { lighten } from 'polished'
import { ms } from '../styles/helpers'

import Button from './Button';
import { H4 } from './Heading'
import ADD_ADDRESS_TYPES from '../constants/AddAddressTypes';
import Loader from './Loader';

import Tooltip from './Tooltip';
import styles from './AddAddressModal.css';
import TezosIcon from "./TezosIcon";

type Props = {
  open: boolean,
  activeTab: string,
  closeModal: Function,
  setActiveTab: Function,
  importAddress: Function,
  seed: string,
  activationCode: string,
  username: string,
  passPhrase: string,
  isLoading: boolean,
  updateUsername: Function,
  updatePassPhrase: Function,
  confirmPassPhrase: Function,
  updateSeed: Function,
  updateActivationCode: Function,
  selectedAccountHash: string
};

const InputWithTooltip = styled.div`
  position: relative;
  
  & button {
    position: absolute;
    top: 50%;
    right: ${ms(-2)};
  }
`

const FormTitle = styled(H4)`
  font-size: ${ms(1)};
`

const HelpIcon = styled(TezosIcon)`
  padding: 0 0 0 ${ms(-4)};
`;

const TooltipContainer = styled.div`
  font-size: ${ms(-1)};
  color: ${({ theme: { colors } }) => colors.secondary};
  max-width: ${ms(16)};
`

const TooltipTitle = styled.p`
  font-weight: ${({theme: {typo}}) => typo.weights.bold};
  margin: 0 0 ${ms(-1)} 0;
`

const TwoColumnsInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  grid-column-gap: ${ms(1)};
`

const ImportButton = styled(Button)`
  margin: ${ms(6)} 0 0 0;
`

const StyledTooltip = styled(Tooltip)`
  &__tooltip-inner {
    background-color: ${({theme: {colors}}) => lighten(0.2, colors.secondary)};
  }
`

const PasswordTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Fundraiser Password</TooltipTitle>
      This is the password that you used when generating a Tezos paper wallet to participate in the Fundraiser.
    </TooltipContainer>
  )
}

const EmailTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Fundraiser Email Address</TooltipTitle>
      This is the email address that you used when generating a Tezos paper wallet to participate in the Fundraiser
    </TooltipContainer>
  )
}

const ActivationTooltip = () => {
  return (
    <TooltipContainer>
      <TooltipTitle>Activation Code</TooltipTitle>
      This is the activation code that you received after completing the KYC/AML process. An activation code corresponds
      to a public key hash and is required if you participated in the Fundraiser.
      You may complete the process at verification.tezos.com if you have not done so already.
    </TooltipContainer>
  )
}

export default function AddAddress(props: Props) {
  const {
    open,
    activeTab,
    closeModal,
    setActiveTab,
    importAddress,
    seed,
    activationCode,
    updateActivationCode,
    username,
    passPhrase,
    isLoading,
    updateUsername,
    updatePassPhrase,
    confirmPassPhrase,
    updateSeed,
    selectedAccountHash
  } = props;

  function renderAppBar() {
    return (
      <div className={styles.titleContainer}>
        <div>Add an Address</div>
          <CloseIcon
            className={styles.closeIcon}
            style={{ fill: 'white' }}
            onClick={closeModal}
          />
      </div>
    );
  }

  function renderTab(tabName) {
    const tabClasses = classNames({
      [styles.tab]: true,
      [styles.inactiveTab]: tabName !== activeTab,
      [styles.activeTab]: tabName === activeTab
    });

    return (
      <div
        key={tabName}
        className={tabClasses}
        onClick={() => setActiveTab(tabName)}
      >
        {tabName}
      </div>
    );
  }

  function renderTabController() {
    return (
      <div className={styles.tabContainer}>
        {Object.values(ADD_ADDRESS_TYPES).map(renderTab)}
      </div>
    );
  }

  function renderAddBody() {
    switch (activeTab) {
      case ADD_ADDRESS_TYPES.GENERATE_MNEMONIC:
        return (
          <div>
            <TextField
              floatingLabelText="Seed Words"
              style={{ width: '100%' }}
              value={seed}
              disabled={activeTab === ADD_ADDRESS_TYPES.GENERATE_MNEMONIC}
              onChange={(_, newSeed) => updateSeed(newSeed)}
            />
            <div className={styles.fundraiserPasswordContainer}>
              <TextField
                floatingLabelText="Pass Phrase"
                type="password"
                style={{ width: '45%' }}
                value={passPhrase}
                onChange={(_, newPassPhrase) => updatePassPhrase(newPassPhrase)}
              />
              <TextField
                floatingLabelText="Confirm Pass Phrase"
                type="password"
                style={{ width: '45%' }}
                onChange={(_, newPassPhrase) =>
                  confirmPassPhrase(newPassPhrase)
                }
              />
            </div>
          </div>
        );
      case ADD_ADDRESS_TYPES.FUNDRAISER:
      default:
        return (
          <Fragment>
            <FormTitle>Please refer to the PDF document that you created during the Fundraiser.</FormTitle>
            <TextField
              floatingLabelText="15 Word Secret Key"
              style={{ width: '100%' }}
              value={seed}
              onChange={(_, newSeed) => updateSeed(newSeed)}
            />
            <InputWithTooltip>
              <TextField
                floatingLabelText="Fundraiser Password"
                type="password"
                style={{ width: '100%' }}
                value={passPhrase}
                onChange={(_, newPassPhrase) => updatePassPhrase(newPassPhrase)}
              />

              <StyledTooltip position="bottom" content={PasswordTooltip}>
                <Button buttonTheme="plain">
                  <HelpIcon
                    iconName="help"
                    size={ms(0)}
                    color="secondary"
                  />
                </Button>
              </StyledTooltip>
            </InputWithTooltip>

            <TwoColumnsInputs>
              <InputWithTooltip>
                <TextField
                  floatingLabelText="Fundraiser Email Address"
                  style={{ width: '100%' }}
                  value={username}
                  onChange={(_, newUsername) => updateUsername(newUsername)}
                />

                <StyledTooltip position="bottom" content={EmailTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon
                      iconName="help"
                      size={ms(0)}
                      color="secondary"
                    />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>

              <InputWithTooltip>
                <TextField
                  floatingLabelText="Activation Code"
                  style={{ width: '100%' }}
                  value={activationCode}
                  onChange={(_, newActivationCode) => updateActivationCode(newActivationCode)}
                />
                <StyledTooltip position="bottom" content={ActivationTooltip}>
                  <Button buttonTheme="plain">
                    <HelpIcon
                      iconName="help"
                      size={ms(0)}
                      color="secondary"
                    />
                  </Button>
                </StyledTooltip>
              </InputWithTooltip>
            </TwoColumnsInputs>
          </Fragment>
        );
    }
  }

  return (
    <Dialog modal open={open} bodyStyle={{ padding: '0px' }}>
      {renderAppBar()}
      {renderTabController()}
      <div className={styles.addAddressBodyContainer}>
        {renderAddBody()}
        <Fragment>
          <ImportButton
            buttonTheme="primary"
            onClick={importAddress}
            disabled={isLoading}
          >
            Import
          </ImportButton>
          {isLoading && <Loader />}
        </Fragment>
      </div>
    </Dialog>
  );
}
