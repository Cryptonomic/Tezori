import React from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { ms } from '../../styles/helpers';
import TezosAddress from '../TezosAddress';
import TezosAmount from '../TezosAmount';
import TezosIcon from '../TezosIcon';
import { openLinkToBlockExplorer } from '../../utils/general';

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
  const realFee = Number.parseInt(fee, 10);
  return !!realFee;
};

const getPosition = (source, myaddress) => source === myaddress;
const getIsAmount = amount => !!amount;

const getStatus = (transaction, selectedAccountHash) => {
  const type = transaction.kind;
  if (type === 'reveal') {
    return {
      icon: 'broadcast',
      preposition: 'of',
      state: 'PUBLIC KEY REVEAL',
      isFee: false,
      color: 'gray8',
      sign: ''
    };
  }

  if (type === 'activation') {
    return {
      icon: 'star',
      preposition: 'of',
      state: 'ACTIVATION',
      isFee: false,
      color: 'gray8',
      sign: ''
    };
  }

  if (type === 'delegation') {
    return {
      icon: 'change',
      preposition: 'to',
      state: 'UPDATED DELEGATE',
      isFee: true,
      color: 'gray8',
      sign: ''
    };
  }

  const isSameLocation = getPosition(transaction.source, selectedAccountHash);
  const isFee = getIsFee(transaction.fee);
  const isAmount = getIsAmount(transaction.amount);

  if (type === 'origination' && isSameLocation) {
    return {
      icon: 'send',
      preposition: '',
      state: 'ORIGINATION',
      isFee,
      color: isAmount ? 'error1' : 'gray8',
      sign: isAmount ? '-' : '',
      isBurn: true
    };
  }

  if (type === 'origination' && !isSameLocation) {
    return {
      icon: 'receive',
      preposition: '',
      state: 'ORIGINATION',
      isFee,
      color: isAmount ? 'check' : 'gray8',
      sign: isAmount ? '+' : ''
    };
  }

  if (type === 'transaction' && isSameLocation) {
    return {
      icon: 'send',
      preposition: 'to',
      state: 'SENT',
      isFee,
      color: isAmount ? 'error1' : 'gray8',
      sign: isAmount ? '-' : ''
    };
  }

  if (type === 'transaction' && !isSameLocation) {
    return {
      icon: 'receive',
      preposition: 'from',
      state: 'RECEIVED',
      isFee: false,
      color: isAmount ? 'check' : 'gray8',
      sign: isAmount ? '+' : ''
    };
  }
};

const getAddress = (transaction, selectedAccountHash, selectedParentHash) => {
  const address =
    transaction.source === selectedAccountHash
      ? transaction.destination
      : transaction.source;
  const type = transaction.kind;
  if (type === 'reveal') {
    return <AddressText>this address</AddressText>;
  }
  if (type === 'delegation') {
    return (
      <TezosAddress
        address={transaction.delegate}
        size='14px'
        weight='200'
        color='black2'
      />
    );
  }
  if (
    type === 'origination' &&
    transaction.source === selectedParentHash &&
    selectedAccountHash !== selectedParentHash
  ) {
    return (
      <AddressText>
        <span>your</span>&nbsp;Account 1 Manager Address
      </AddressText>
    );
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
  selectedParentHash: string
};

function Transaction(props: Props) {
  const { transaction, selectedAccountHash, selectedParentHash } = props;
  const fee = Number.parseInt(transaction.fee, 10);
  const { icon, preposition, state, isFee, color, sign, isBurn } = getStatus(
    transaction,
    selectedAccountHash,
    selectedParentHash
  );
  const amount = transaction.amount ? parseInt(transaction.amount, 10) : 0;
  const address = getAddress(
    transaction,
    selectedAccountHash,
    selectedParentHash
  );

  return (
    <TransactionContainer>
      <Header>
        <TransactionDate>
          {timeFormatter(props.transaction.timestamp)}
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
            onClick={() => openLink(transaction.operationGroupHash)}
          />
        </ContentDiv>
        {isBurn && (
          <Fee>
            <span>Burn: </span>
            <TezosAmount color="gray5" size={ms(-2)} amount={257000} format={6} />
          </Fee>
        )}
        {isBurn && isFee && <Linebar />}
        {isFee && (
          <Fee>
            <span>Fee: </span>
            <TezosAmount color="gray5" size={ms(-2)} amount={fee} format={6} />
          </Fee>
        )}
      </Container>
    </TransactionContainer>
  );
}

export default Transaction;
