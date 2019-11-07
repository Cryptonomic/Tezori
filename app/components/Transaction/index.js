import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { ms } from '../../styles/helpers';
import TezosAddress from '../TezosAddress/';
import TezosAmount from '../TezosAmount/';
import TezosIcon from '../TezosIcon/';
import { openLinkToBlockExplorer } from '../../utils/general';
import * as types from '../../constants/TransactionTypes';
import { READY } from '../../constants/StatusTypes';
import {
  REG_TX_GAS_CONSUMPTION,
  REG_TX_GAS_CONSUMPTION_ATHENS,
  EMPTY_OUT_TX_GAS_CONSUMPTION
} from '../../constants/ConsumedGasValue';
import { wrapComponent } from '../../utils/i18n';

const AmountContainer = styled.div`
  color: ${({ theme: { colors }, color }) => colors[color]};
  font-size: ${ms(-1)};
`;
const TransactionContainer = styled.div`
  padding: 8px 25px 17px 25px;
  border-bottom: solid 1px ${({ theme: { colors } }) => colors.gray7};
  &:last-child {
    border: none;
  }
`;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ContentDiv = styled.div`
  display: flex;
  align-items: baseline;
  line-height: 14px;
  flex: 1;
`;
const StateIcon = styled(TezosIcon)`
  margin-right: 5px;
`;
const LinkIcon = styled(TezosIcon)`
  margin-left: 6px;
  cursor: pointer;
`;
const StateText = styled.div`
  font-size: 10px;
  color: ${({ theme: { colors } }) => colors.accent};
  span {
    font-size: 12px;
    color: ${({ theme: { colors } }) => colors.gray6};
    margin: 0 6px;
  }
`;
const AddressText = styled.div`
  color: ${({ theme: { colors } }) => colors.black2};
  font-size: 12px;
  font-weight: 500;
`;
const TransactionDate = styled.div`
  color: ${({ theme: { colors } }) => colors.gray5};
`;

const Fee = styled.div`
  font-size: ${ms(-2)};
  color: ${({ theme: { colors } }) => colors.gray5};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme: { colors } }) => colors.gray5};
  font-size: 12px;
  line-height: 30px;
`;

const Linebar = styled.div`
  height: 14px;
  margin: 0 7px 0 5px;
  width: 1px;
  background-color: ${({ theme: { colors } }) => colors.gray10};
  opacity: 0.29;
`;

const openLink = element => openLinkToBlockExplorer(element);
const timeFormatter = timestamp => {
  const time = new Date(timestamp);
  return moment(time).format('LT');
};

const getIsFee = fee => {
  const userFee = Number.parseInt(fee, 10);
  return !!userFee;
};

const getPosition = (source, myaddress) => source === myaddress;
const getIsAmount = amount => !!amount;

const getStatus = (transaction, selectedAccountHash, t) => {
  const type = transaction.kind;
  if (type === types.REVEAL) {
    return {
      icon: 'broadcast',
      preposition: t('general.of'),
      state: t('components.transaction.public_key_reveal'),
      isFee: false,
      color: 'gray8',
      sign: ''
    };
  }

  if (type === types.ACTIVATION) {
    return {
      icon: 'star',
      preposition: t('general.of'),
      state: t('components.transaction.activitation'),
      isFee: false,
      color: 'gray8',
      sign: ''
    };
  }

  if (type === types.DELEGATION) {
    return {
      icon: 'change',
      preposition: t('general.to'),
      state: t('components.transaction.updated_delegate'),
      isFee: true,
      color: 'gray8',
      sign: ''
    };
  }

  const isSameLocation = getPosition(transaction.source, selectedAccountHash);
  const isFee = getIsFee(transaction.fee);
  const isAmount = getIsAmount(transaction.amount);

  if (type === types.ORIGINATION && isSameLocation) {
    return {
      icon: 'send',
      preposition: t('general.of'),
      state: t('components.transaction.origination'),
      isFee,
      color: isAmount ? 'error1' : 'gray8',
      sign: isAmount ? '-' : '',
      isBurn: true
    };
  }

  if (type === types.ORIGINATION && !isSameLocation) {
    return {
      icon: 'receive',
      preposition: '',
      state: t('components.transaction.origination'),
      isFee,
      color: isAmount ? 'check' : 'gray8',
      sign: isAmount ? '+' : ''
    };
  }

  if (type === types.TRANSACTION && isSameLocation) {
    if (
      !transaction.parameters &&
      (transaction.consumed_gas === REG_TX_GAS_CONSUMPTION ||
        transaction.consumed_gas === REG_TX_GAS_CONSUMPTION_ATHENS ||
        transaction.consumed_gas === EMPTY_OUT_TX_GAS_CONSUMPTION)
    ) {
      return {
        icon: 'send',
        preposition: t('general.to'),
        state: t('components.transaction.sent'),
        isFee,
        color: isAmount ? 'error1' : 'gray8',
        sign: isAmount ? '-' : ''
      };
    }
    return {
      icon: 'send',
      preposition: t('general.of'),
      state: t('components.transaction.invoke_function'),
      isFee: true,
      color: isAmount ? 'error1' : 'gray8',
      sign: isAmount ? '-' : ''
    };
  }

  if (type === types.TRANSACTION && !isSameLocation) {
    if (
      !transaction.parameters &&
      (transaction.consumed_gas === REG_TX_GAS_CONSUMPTION ||
        transaction.consumed_gas === REG_TX_GAS_CONSUMPTION_ATHENS ||
        transaction.consumed_gas === EMPTY_OUT_TX_GAS_CONSUMPTION)
    ) {
      return {
        icon: 'receive',
        preposition: t('general.from'),
        state: t('components.transaction.received'),
        isFee: false,
        color: isAmount ? 'check' : 'gray8',
        sign: isAmount ? '+' : ''
      };
    }
    return {
      icon: 'receive',
      preposition: t('general.by'),
      state: t('components.transaction.invoked'),
      isFee,
      color: isAmount ? 'check' : 'gray8',
      sign: isAmount ? '+' : ''
    };
  }
};

const getAddress = (
  transaction,
  selectedAccountHash,
  selectedParentHash,
  t
) => {
  const address =
    transaction.source === selectedAccountHash
      ? transaction.destination
      : transaction.source;

  const type = transaction.kind;
  if (type === types.ACTIVATION) {
    return (
      <AddressText>{t('components.transaction.this_address')}</AddressText>
    );
  }
  if (type === types.REVEAL) {
    return (
      <AddressText>{t('components.transaction.this_address')}</AddressText>
    );
  }
  if (type === types.DELEGATION) {
    return (
      <TezosAddress
        address={transaction.delegate}
        size="14px"
        weight="200"
        color="black2"
      />
    );
  }
  if (
    type === types.ORIGINATION &&
    transaction.source === selectedParentHash &&
    selectedAccountHash === selectedParentHash
  ) {
    return (
      <TezosAddress
        address={transaction.originated_contracts}
        size="14px"
        weight="200"
        color="black2"
      />
    );
  }
  if (
    type === types.ORIGINATION &&
    transaction.source === selectedParentHash &&
    selectedAccountHash !== selectedParentHash
  ) {
    return null;
  }

  if (!address) {
    return null;
  }
  return (
    <TezosAddress address={address} size="14px" weight="200" color="black2" />
  );
};

type Props = {
  transaction: object,
  selectedAccountHash: string,
  selectedParentHash: string,
  t: () => {}
};

function Transaction(props: Props) {
  const { transaction, selectedAccountHash, selectedParentHash, t } = props;
  const fee = transaction.fee ? Number.parseInt(transaction.fee, 10) : 0;
  const { icon, preposition, state, isFee, color, sign, isBurn } = getStatus(
    transaction,
    selectedAccountHash,
    t
  );
  let amount = 0;
  if (transaction.amount) {
    amount = parseInt(transaction.amount, 10);
  } else if (transaction.balance) {
    amount = parseInt(transaction.balance, 10);
  }
  const address = getAddress(
    transaction,
    selectedAccountHash,
    selectedParentHash,
    t
  );
  const origination =
    transaction.kind === 'origination' &&
    selectedAccountHash !== selectedParentHash;
  const activation =
    transaction.kind === 'activation' &&
    selectedAccountHash === selectedParentHash;
  return (
    <TransactionContainer>
      <Header>
        <TransactionDate>
          {transaction.status === READY || origination || activation
            ? timeFormatter(transaction.timestamp)
            : t('components.transaction.pending')}
        </TransactionDate>
        <AmountContainer color={color}>
          {sign}
          <TezosAmount color={color} size={ms(-1)} amount={amount} format={6} />
        </AmountContainer>
      </Header>
      <Container>
        <ContentDiv>
          <StateIcon iconName={icon} size={ms(-2)} color="accent" />
          <StateText>
            {state}
            {address ? <span>{preposition}</span> : null}
          </StateText>
          {address}
          <LinkIcon
            iconName="new-window"
            size={ms(0)}
            color="primary"
            onClick={() => openLink(transaction.operation_group_hash)}
          />
        </ContentDiv>
        {isBurn && (
          <Fee>
            <span>{t('components.transaction.burn')}: </span>
            <TezosAmount
              color="gray5"
              size={ms(-2)}
              amount={257000}
              format={6}
            />
          </Fee>
        )}
        {isBurn && isFee && <Linebar />}
        {isFee && (
          <Fee>
            <span>{t('general.nouns.fee')}: </span>
            <TezosAmount color="gray5" size={ms(-2)} amount={fee} format={6} />
          </Fee>
        )}
      </Container>
    </TransactionContainer>
  );
}

export default wrapComponent(Transaction);
