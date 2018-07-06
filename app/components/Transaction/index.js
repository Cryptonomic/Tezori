import React from 'react'
import { shell } from 'electron'
import styled from 'styled-components'
import moment from 'moment'
import { TableRow } from 'material-ui'
import { isNumber } from 'lodash'
import { ms } from '../../styles/helpers'
import TezosAddress from '../TezosAddress'
import TezosAmount from '../TezosAmount'

const openLink = element => shell.openExternal(`https://tzscan.io/${element}`)

const timeFormatter = timestamp => {
  const time = new Date (timestamp)
  return moment(time).format('LT')
}

const AmountContainer = styled.td`
  justify-self: end;
`

const TransactionContainer = styled(TableRow)`
  display: grid;
  flex-direction: row;
  align-items: center;
  grid-template-columns: 2fr 5fr 2fr 2fr;
  padding: ${ms(-4)} ${ms(4)};
  border-bottom: 2px solid ${ ({ theme: { colors } }) => colors.gray6 };
  @media (max-width: 1200px) {
    padding: ${ms(-4)} ${ms(-4)};
    grid-template-columns: 1.5fr 7fr 2fr 2fr;
  }
`

const Link = styled.td`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: ${({ theme: { colors } }) => colors.gray5};
  color: ${({ theme: { colors } }) => colors.gray7};
  padding: 0 10px 0 0;
`;

const SingleTransactionDate = styled.td`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.bold };
`

const TransactionDate = styled.td`
  color: ${ ({ theme: { colors } }) => colors.gray5 };
`

const Fee = styled.div`
  font-size: ${ms(-2)};
  color: ${ ({ theme: { colors } }) => colors.gray5 };
`

const OutgoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
type OutgoProps = {
  fee: ?number,
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
        format={6}
        fee
      />
      <Fee>
        <span>Fee: </ span>
        <TezosAmount
          color={'gray5'}
          size={ms(-2)}
          amount={fee}
          format={6}
        />
      </Fee>
    </OutgoContainer>
  )
}

type AmountProps = {
  amount: number,
  fee: ?number,
}

const Amount = (props:AmountProps) => {
  const { fee, amount } = props
    return <AmountContainer>
      {isNumber(fee)
      ? <Outgo
        fee={props.fee}
        amount={props.amount}
      />
      : <TezosAmount
        color={'green'}
        size={ms(0)}
        amount={props.amount}
        format={6}
        positive
      />}
      </AmountContainer>
}

type Props = {
  address: string,
  date: number,
  fee: ?number,
  amount: number,
  element?: string,
}

const Transaction = (props) => {
  const { address, date, fee, amount, element } = props
  return (
    <TransactionContainer>
      <SingleTransactionDate>{timeFormatter(date)}</SingleTransactionDate>
      <td>
        <TezosAddress
          address={address}
          color={'gray7'}
          size={ms(0)}
        />
      </td>
      <Amount fee={fee} amount={amount} />
      <Link onClick={() => {}}>
        Details
      </Link>
    </TransactionContainer>
  )
}

Transaction.defaultProps = {
  address: 'tz1YttHzJvUU6BJqEh4HZKzB19j48uxUbjFc',
}

export default Transaction
