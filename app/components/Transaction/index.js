import React from 'react'
import { shell } from 'electron'
import styled from 'styled-components'
import moment from 'moment'
import { ms } from '../../styles/helpers'
import TezosAddress from '../TezosAddress'
import TezosAmount from '../TezosAmount'
import TezosIcon from "../TezosIcon"

const AmountContainer = styled.div`
  color: ${ ({ theme: { colors }, color }) => colors[color] };
  font-size: ${ms(-1)};
`
const TransactionContainer = styled.div`
  padding: 8px 25px 17px 25px;
  border-bottom: solid 1px ${ ({ theme: { colors } }) => colors.gray7 };
  &:last-child {
    border: none;
  }
`
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const ContentDiv = styled.div`
  display: Flex;
  align-items:center;
  line-height: 14px;
`
const StateIcon = styled(TezosIcon)`
  margin-right: 5px;
`
const LinkIcon = styled(TezosIcon)`
  margin-left: 6px;
`
const StateText = styled.div`
  font-size: 10px;
  color: ${ ({ theme: { colors } }) => colors.accent };
  span {
    font-size: 12px;
    color: ${ ({ theme: { colors } }) => colors.gray6 };
    margin: 0 6px;
  }  
`
const AddressText = styled.div`
  color: ${ ({ theme: { colors } }) => colors.black2 };
  font-size: 12px;
  font-weight: 500;
`
const TransactionDate = styled.div`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
`

const Fee = styled.div`
  font-size: ${ms(-2)};
  color: ${ ({ theme: { colors } }) => colors.gray5 };
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${ ({ theme: { colors } }) => colors.gray5 };
  font-size: 12px;
  line-height: 30px;
`

const openLink = element => shell.openExternal(`https://tzscan.io/${element}`)

const timeFormatter = timestamp => {
  const time = new Date (timestamp)
  return moment(time).format('LT')
}

const getStatus = (transaction, selectedAccountHash) => {
  const status = {icon: 'receive', preposition: 'from', state: 'RECEIVED', isFee: false, color: 'error1', sign: '-'};
  const type = transaction.kind;
  if (type === 'reveal') {
    return {icon: 'broadcast', preposition: 'of', state: 'KEY REVEAL', isFee: false, color: 'gray8', sign: ''};
  }
  if (transaction.source === selectedAccountHash) {
    status.icon = 'send';
    status.preposition = 'to';
    status.state = 'SENT';
    status.isFee = true;
    status.color = 'check';
    status.sign = '+';
  }

  if (!transaction.amount) {
    status.color = 'gray8';
    status.sign = '';
  }

  if (type === 'origination') {
    status.state = 'ORIGINATION';
    status.isFee = false;
  }
  return status;
}

const getAddress = (transaction, selectedAccountHash, selectedParentHash) => {
  const address = transaction.source === selectedAccountHash? transaction.destination : transaction.source;
  const type = transaction.kind;
  if (type === 'origination' || type === 'reveal') {
    if (transaction.source === selectedAccountHash) {
      return <AddressText>this address</AddressText>;
    }

    if (transaction.source === selectedParentHash) {
      return <AddressText><span>your</span>&nbsp;Account 1 Manager Address</AddressText>;
    }
    return (
      <TezosAddress
        address={transaction.source}
        size='14px'
        weight='200'
        color='black2'
      />
    );    
  }
  return (
    <TezosAddress
      address={address}
      size='14px'
      weight='200'
      color='black2'
    />
  );
}

type Props = {
  transaction: Object,
  selectedAccountHash: string,
  selectedParentHash: string
};

const Transaction = (props: Props) => {
  const { transaction, selectedAccountHash, selectedParentHash } = props;
  const fee = Number.parseInt(transaction.fee, 10);
  const {icon, preposition, state, isFee, color, sign} = getStatus(transaction, selectedAccountHash, selectedParentHash);
  const amount = transaction.amount? Number.parseInt(transaction.amount, 10) : 0;
  
  return (
    <TransactionContainer>
      <Header>
        <TransactionDate>{timeFormatter(props.transaction.timestamp)}</TransactionDate>
        <AmountContainer color={color}>
          {sign}
          <TezosAmount
            color={color}
            size={ms(-1)}
            amount={amount}
            format={6}
          />
        </AmountContainer>
      </Header>
      <Container>
        <ContentDiv>        
          <StateIcon
            iconName={icon}
            size={ms(-2)}
            color="accent"
          />
          <StateText>
            {state}<span>{preposition}</span>
          </StateText>
          {getAddress(transaction, selectedAccountHash, selectedParentHash)}
          <LinkIcon
            iconName='new-window'
            size={ms(0)}
            color="primary"
            onClick={()=>openLink(transaction.operationId)}
          />

        </ContentDiv>
        {isFee && 
          <Fee>
            <span>Fee: </span>
            <TezosAmount
              color='gray5'
              size={ms(-2)}
              amount={fee}
              format={6}
            />
          </Fee>
        }
      </Container>       
    </TransactionContainer>
  )
}

export default Transaction
