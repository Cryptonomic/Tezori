// @flow
import React, { useState, useEffect } from 'react';
import { bindActionCreators, compose } from 'redux';
import { connect } from 'react-redux';
import { Trans } from 'react-i18next';

import { wrapComponent } from '../../utils/i18n';
import InputAddress from '../InputAddress';
import Fees from '../Fees';
import PasswordInput from '../PasswordInput';
import Tooltip from '../Tooltip';
import TezosIcon from './../TezosIcon';
import DelegateLedgerConfirmationModal from '../DelegateLedgerConfirmationModal';
import { ms } from '../../styles/helpers';

import { getIsReveal } from '../../reduxContent/wallet/thunks';
import fetchAverageFees from '../../reduxContent/generalThunk';
import { getIsLedger } from '../../reduxContent/wallet/selectors';
import { setIsLoading } from '../../reduxContent/wallet/actions';
import { delegate } from '../../reduxContent/delegate/thunks';

import { OPERATIONFEE, REVEALOPERATIONFEE } from '../../constants/LowFeeValue';

import {
  Container,
  AmountContainer,
  FeeContainer,
  PasswordButtonContainer,
  InvokeButton,
  WarningContainer,
  InfoText,
  TooltipContainer,
  TooltipTitle,
  TooltipContent,
  BoldSpan,
  FeeTooltip,
  HelpIcon
} from './style';

type Props = {
  isReady?: boolean,
  isLedger: boolean,
  isLoading: boolean,
  selectedParentHash: string,
  selectedAccountHash: string,
  fetchAverageFees: () => {},
  getIsReveal: () => {},
  delegate: () => {},
  setIsLoading: () => {},
  t: () => {}
};

function Delegate(props: Props) {
  const [miniFee, setMiniFee] = useState(0);
  const [averageFees, setAverageFees] = useState({
    low: 1420,
    medium: 2840,
    high: 5680
  });
  const [fee, setFee] = useState(
    props.selectedAccountHash.startsWith('KT1')
      ? averageFees.medium
      : averageFees.low
  );
  const [newAddress, setAddress] = useState('');
  const [passPhrase, setPassPhrase] = useState('');
  const [isAddressIssue, setIsAddressIssue] = useState(false);
  const [isShowedPwd, setIsShowedPwd] = useState(false);
  const [isDisplayedFeeTooltip, setIsDisplayedFeeTooltip] = useState(false);
  const [isOpenLedgerConfirm, setIsOpenLedgerConfirm] = useState(false);
  const {
    isReady,
    isLoading,
    isLedger,
    selectedAccountHash,
    selectedParentHash,
    fetchAverageFees,
    delegate,
    setIsLoading,
    getIsReveal,
    t
  } = props;

  async function getFeesAndReveals() {
    const averageFees = await fetchAverageFees('delegation');
    const isRevealed = await getIsReveal(
      selectedAccountHash,
      selectedParentHash
    );
    let miniLowFee = OPERATIONFEE;
    if (!isRevealed) {
      averageFees.low += REVEALOPERATIONFEE;
      averageFees.medium += REVEALOPERATIONFEE;
      averageFees.high += REVEALOPERATIONFEE;
      miniLowFee += REVEALOPERATIONFEE;
    }
    if (averageFees.low < miniLowFee) {
      averageFees.low = miniLowFee;
    }
    setAverageFees({ ...averageFees });
    setFee(
      props.selectedAccountHash.startsWith('KT1')
        ? averageFees.medium
        : averageFees.low
    );
    setMiniFee(miniLowFee);
    setIsDisplayedFeeTooltip(!isRevealed);
  }

  useEffect(() => {
    getFeesAndReveals();
  }, [selectedAccountHash]);

  function onLedgerConfirmation(val) {
    setIsOpenLedgerConfirm(val);
  }

  async function onDelegate() {
    setIsLoading(true);

    if (isLedger) {
      onLedgerConfirmation(true);
    }

    await delegate(
      newAddress,
      fee,
      passPhrase,
      selectedAccountHash,
      selectedParentHash
    ).catch(err => {
      console.error(err);
      return false;
    });

    onLedgerConfirmation(false);
    setIsLoading(false);
  }

  function onEnterPress(keyVal, isDisabled) {
    if (keyVal === 'Enter' && !isDisabled) {
      onDelegate();
    }
  }

  const renderFeeToolTip = () => {
    return (
      <TooltipContainer>
        <TooltipTitle>{t('components.send.fee_tooltip_title')}</TooltipTitle>
        <TooltipContent>
          <Trans i18nKey="components.send.fee_tooltip_content">
            This address is not revealed on the blockchain. We have added
            <BoldSpan>0.001300 XTZ</BoldSpan> for Public Key Reveal to your
            regular send operation fee.
          </Trans>
        </TooltipContent>
      </TooltipContainer>
    );
  };

  const isDisabled =
    !isReady ||
    isLoading ||
    isAddressIssue ||
    !newAddress ||
    (!passPhrase && !isLedger);

  return (
    <Container onKeyDown={event => onEnterPress(event.key, isDisabled)}>
      <AmountContainer>
        <InputAddress
          labelText={t(
            'components.delegateConfirmationModal.new_address_label'
          )}
          operationType="delegate"
          tooltip={false}
          onAddressChange={val => setAddress(val)}
          onIssue={val => setIsAddressIssue(val)}
        />
      </AmountContainer>
      <FeeContainer>
        <Fees
          low={averageFees.low}
          medium={averageFees.medium}
          high={averageFees.high}
          fee={fee}
          miniFee={miniFee}
          onChange={val => setFee(val)}
          tooltip={
            isDisplayedFeeTooltip ? (
              <Tooltip
                position="bottom"
                content={renderFeeToolTip}
                align={{
                  offset: [70, 0]
                }}
                arrowPos={{
                  left: '71%'
                }}
              >
                <FeeTooltip buttonTheme="plain">
                  <HelpIcon iconName="help" size={ms(1)} color="gray5" />
                </FeeTooltip>
              </Tooltip>
            ) : null
          }
        />
      </FeeContainer>

      <WarningContainer>
        <TezosIcon iconName="info" size={ms(5)} color="info" />
        <InfoText>
          {t('components.delegateConfirmationModal.delegate_warning')}
        </InfoText>
      </WarningContainer>

      <PasswordButtonContainer>
        {!isLedger && (
          <PasswordInput
            label={t('general.nouns.wallet_password')}
            isShowed={isShowedPwd}
            password={passPhrase}
            changFunc={passPhrase => setPassPhrase(passPhrase)}
            containerStyle={{ width: '60%', marginTop: '10px' }}
            onShow={() => setIsShowedPwd(!isShowedPwd)}
          />
        )}
        <InvokeButton
          buttonTheme="primary"
          disabled={isDisabled}
          onClick={() => onDelegate()}
        >
          {t('components.delegate.change_delegate')}
        </InvokeButton>
      </PasswordButtonContainer>
      {isLedger && isOpenLedgerConfirm && (
        <DelegateLedgerConfirmationModal
          fee={fee}
          address={newAddress}
          source={selectedAccountHash}
          open={isOpenLedgerConfirm}
          onCloseClick={() => onLedgerConfirmation(false)}
          isLoading={isLoading}
        />
      )}
    </Container>
  );
}

function mapStateToProps(state) {
  return {
    isLedger: getIsLedger(state),
    isLoading: state.wallet.get('isLoading')
  };
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchAverageFees,
      delegate,
      setIsLoading,
      getIsReveal
    },
    dispatch
  );

export default compose(
  wrapComponent,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Delegate);
