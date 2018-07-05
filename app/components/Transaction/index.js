import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { isNumber } from 'lodash'
import { ms } from '../../styles/helpers'
import TezosAddress from '../TezosAddress'
import TezosAmount from '../TezosAmount'

const openLink = element => shell.openExternal(`https://tzscan.io/${element}`)

const timeFormatter = time => moment(time).format('LT')

const TransactionContainer = styled.div`
  display: grid;
  flex-direction: row;
  align-items: center;
  grid-template-columns: 2fr 5fr 2fr 1fr;
  padding: ${ms(-4)} ${ms(4)};
  border-bottom: 2px solid ${ ({ theme: { colors } }) => colors.gray6 };
`

const Link = styled.span`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: ${({ theme: { colors } }) => colors.gray5};
  color: ${({ theme: { colors } }) => colors.gray7};
  padding: 0 10px 0 0;
`;

const SingleTransactionDate = styled.span`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.bold };
`

const TransactionDate = styled.span`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
`

const Fee = styled.div`
  font-size: ${ms(-2)};
  color: ${ ({ theme: { colors } }) => colors.gray5 };
`

const OutgoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`
type OutgoProps = {
  fee: number,
  amount: number,
}

const Outgo = (props:OutgoProps) => {
  const { fee, amount } = props
  return ( 
    <OutgoContainer>
      <TezosAmount
        color={'red'}
        size={ms(0)}
        amount={amount}
        format={2}
      />
      <Fee>
        Fee:
        <TezosAmount
          color={'gray5'}
          size={ms(-2)}
          amount={fee}
          format={2}
        />
      </Fee>
    </OutgoContainer>
  )
}

type AmountProps = {
  amount: number,
  fee?: number,
}

const Amount = (props:AmountProps) => {
  const { fee, amount } = props
    return isNumber(fee)
      ? <Outgo
        fee={props.fee}
        amount={props.amount}
      />
      : <TezosAmount
        color={'green'}
        size={ms(0)}
        amount={props.amount}
        format={2}
      />
}

type Props = {
  address: string,
  date: Date,
  fee?: number,
  amount: number,
  element?: string,
}

const Transaction = (props) => {
  const { address, date, fee, amount, element } = props
  return (
    <TransactionContainer>
      <SingleTransactionDate>{timeFormatter(date)}</SingleTransactionDate>
      <TezosAddress
        address={address}
        color={'gray7'}
        size={ms(0)}
      />
      <Amount fee={fee} amount={amount} />
      <Link onClick={() => {}}>
        Details
      </Link>
    </TransactionContainer>
  )
}

Transaction.defaultProps = {
  address: 'tz1YttHzJvUU6BJqEh4HZKzB19j48uxUbjFc',
  date: new Date(),
}

export default Transaction
