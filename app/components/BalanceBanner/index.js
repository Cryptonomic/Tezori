// @flow
import React, { useState } from 'react';
import { compose } from 'redux';
import styled, { withTheme } from 'styled-components';
import { lighten } from 'polished';
import { StoreType } from 'conseiljs';
import { ms } from '../../styles/helpers';
import { H4 } from '../Heading/';
import TezosAmount from '../TezosAmount/';
import TezosAddress from '../TezosAddress/';
import TezosIcon from '../TezosIcon/';
import Update from '../Update/';
import Modal from '../CustomModal';
import Button from '../Button';
import { wrapComponent } from '../../utils/i18n';

import keyIconSvg from '../../../resources/imgs/Key_Icon.svg';
import circleKeyIconSvg from '../../../resources/imgs/Circle_Key_Icon.svg';

const { Mnemonic } = StoreType;

type Props = {
  storeType?: string | number,
  isReady: boolean,
  balance: number,
  publicKeyHash: string,
  privateKey: string,
  onRefreshClick: () => {},
  isManagerAddress: boolean,
  isContractAddress?: boolean,
  theme: object,
  parentIndex?: number,
  delegatedAddress?: string | null,
  time?: Date,
  t: () => {},
  isWalletSyncing?: boolean,
  addressIndex: string
};

const Container = styled.header`
  padding: ${ms(0)} ${ms(4)};
  background-color: ${({ theme: { colors } }) => colors.accent};
`;

const Row = styled.div`
  margin: 0 0 ${ms(3)} 0;
`;

const TopRow = styled(Row)`
  display: flex;
  justify-content: space-between;
  color: ${({ theme: { colors } }) => lighten(0.3, colors.accent)};
  opacity: ${({ isReady }) => (isReady ? '1' : '0.5')};
`;

const BottomRow = styled(Row)`
  color: ${({ theme: { colors } }) => colors.white};
  opacity: ${({ isReady }) => (isReady ? '1' : '0.5')};
`;

const AddressTitle = styled(H4)`
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.bold};
  color: ${({ theme: { colors } }) => colors.white};
  margin: 0;
  line-height: 1.75;
  font-size: ${ms(2.2)};
`;

const AddressTitleIcon = styled(TezosIcon)`
  padding: 0 ${ms(-6)} 0 0;
`;

const AddressInfo = styled.div`
  display: flex;
  align-items: center;
  line-height: 1.9;
  flex-wrap: wrap;
`;

const Amount = styled(TezosAmount)`
  margin: 0;
  padding: ${ms(-3)} 0;
  line-height: 1;
`;

const Delegate = styled.span`
  color: ${({ theme: { colors } }) => colors.white};
  font-size: ${ms(-1)};
  font-weight: ${({
    theme: {
      typo: { weights }
    }
  }) => weights.light};
  margin-right: 6px;
`;

const DelegateContainer = styled.div`
  display: flex;
`;

const Breadcrumbs = styled.div`
  font-size: ${ms(-1)};
`;

const CircleKeyIcon = styled.img`
  width: 27px;
`;

const KeyIcon = styled.img`
  width: 12px;
  height: 13px;
  margin-left: 10px;
  cursor: pointer;
`;

const ModalContent = styled.div`
  padding: 35px 76px 25px 76px;
`;

const ButtonContainer = styled.div`
  width: 100%;
  margin-top: 75px;
  text-align: center;
`;

const CloseButton = styled(Button)`
  width: 194px;
  height: 50px;
`;

const HideShowContainer = styled.div`
  color: ${({ theme: { colors } }) => colors.gray5};
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  cursor: pointer;
  width: 100%;
`;

const KeyContainer = styled.div`
  color: ${({ theme: { colors } }) => colors.primary};
  font-size: 16px;
  font-weight: 400;
  line-height: 19px;
  padding: 20px 19px 14px 19px;
  margin-top: 10px;
  width: 100%;
  word-wrap: break-word;
`;

const WarningContainer = styled.div`
  border-radius: 3px;
  border: 1px solid ${({ theme: { colors } }) => colors.index1};
  width: 475%;
  height: 91px;
  padding: 0 39px 0 29px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 50px;
  font-size: 16px;
  line-height: 19px;
  color: rgb(18, 50, 98);
`;

const WarningTxt = styled.span`
  font-weight: 700;
`;

const StoreTxt = styled.div`
  font-weight: 400;
  margin-left: 23px;
`;

function BalanceBanner(props: Props) {
  const {
    storeType,
    isReady,
    balance,
    privateKey,
    publicKeyHash,
    onRefreshClick,
    theme,
    parentIndex,
    isManagerAddress,
    time,
    delegatedAddress,
    t,
    isWalletSyncing,
    isContractAddress,
    addressIndex
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const [isShowKey, setIsShowKey] = useState(false);

  const secretPrivateKey = privateKey.split('').map(() => '*');

  let addressLabel = '';
  if (isManagerAddress) {
    addressLabel = t('components.address.manager_address');
  } else if (isContractAddress) {
    addressLabel = `${t('general.nouns.smart_contract')} ${addressIndex}`;
  } else {
    addressLabel = t('components.address.delegated_address', {
      index: addressIndex
    });
  }

  const breadcrumbs = t('components.balanceBanner.breadcrumbs', {
    parentIndex,
    addressLabel
  });

  return (
    <Container>
      <TopRow isReady={isReady}>
        <Breadcrumbs>{breadcrumbs}</Breadcrumbs>
        <Update
          onClick={onRefreshClick}
          time={time}
          isReady={isReady}
          isWalletSyncing={isWalletSyncing}
        />
      </TopRow>
      <BottomRow isReady={isReady}>
        {!isContractAddress && (
          <AddressTitle>
            <AddressTitleIcon
              iconName={isManagerAddress ? 'manager' : 'smart-address'}
              size={ms(0)}
              color="white"
            />
            {addressLabel}

            {isManagerAddress && (
              <KeyIcon src={keyIconSvg} onClick={() => setIsOpen(true)} />
            )}
          </AddressTitle>
        )}
        <AddressInfo>
          <TezosAddress
            address={publicKeyHash}
            weight={theme.typo.weights.light}
            color="white"
            text={publicKeyHash}
            size={ms(1.7)}
          />

          {isReady || storeType === Mnemonic ? (
            <Amount
              color="white"
              size={ms(4.5)}
              amount={balance}
              weight="light"
              format={2}
              showTooltip
            />
          ) : null}
        </AddressInfo>
        {delegatedAddress && (
          <DelegateContainer>
            <Delegate>{t('components.balanceBanner.delegated_to')}</Delegate>
            <TezosAddress
              address={delegatedAddress}
              color="white"
              size={ms(-1)}
              weight={300}
            />
          </DelegateContainer>
        )}
      </BottomRow>
      <Modal
        title={t('components.balanceBanner.secret_key')}
        open={isOpen}
        onClose={() => setIsOpen(false)}
        style={{ width: '671px' }}
      >
        <ModalContent>
          <HideShowContainer onClick={() => setIsShowKey(!isShowKey)}>
            {isShowKey
              ? t('components.balanceBanner.hide_key')
              : t('components.balanceBanner.reveal_key')}
          </HideShowContainer>
          <KeyContainer>
            {isShowKey ? privateKey : secretPrivateKey}
          </KeyContainer>
          <WarningContainer>
            <CircleKeyIcon src={circleKeyIconSvg} />
            <StoreTxt>
              <WarningTxt>{t('components.balanceBanner.warning')}</WarningTxt>
              {t('components.balanceBanner.do_not_store')}
            </StoreTxt>
          </WarningContainer>
          <ButtonContainer>
            <CloseButton buttonTheme="primary" onClick={() => setIsOpen(false)}>
              {t('general.verbs.close')}
            </CloseButton>
          </ButtonContainer>
        </ModalContent>
      </Modal>
    </Container>
  );
}

BalanceBanner.defaultProps = {
  parentIndex: 0,
  isWalletSyncing: false
};

export default compose(
  wrapComponent,
  withTheme
)(BalanceBanner);
