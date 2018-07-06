import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { TableRow } from 'material-ui'
import { ms } from '../../styles/helpers'
import TezosAmount from '../TezosAmount'

const TodayYesterdayFormat = {
  lastDay : '[Yesterday]',
  sameDay : '[Today]'
}

const timestampFormatter = timestamp => {
  const date = new Date(1000 * timestamp)
  const time =  moment(date).isBetween(moment().subtract(2, 'days'), moment())
    ? moment(date).calendar(null, TodayYesterdayFormat)
    : moment(date).format('MMMM DD')
    return time
}

const DateContainer = styled(TableRow)`
  background-color: ${ ({ theme: { colors } }) => colors.gray1 };
  border-bottom: 2px solid ${ ({ theme: { colors } }) => colors.gray6 };
  display: grid;
  grid-template-columns: 7fr 2fr 2fr;
  padding: ${ms(-4)} ${ms(4)};
  align-items: center;
  @media (max-width: 1200px) {
    padding: ${ms(-4)} ${ms(-4)};
    grid-template-columns: 8.5fr 2fr 2fr;
  }
`

const TransactionsDate = styled.td`
  color: ${ ({ theme: { colors } }) => colors.secondary };
  line-height: 1.63;
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.bold };
`

const Amount = styled.td`
  justify-self: end;
`

type Props = {
  date: number,
  amount: number,
}

const TransactionsLabel = (props:Props) => {
  const { date, amount } = props
  return (
    <DateContainer>
      <TransactionsDate>{timestampFormatter(date)}</TransactionsDate>
      <Amount>
      <TezosAmount 
        color={'secondary'}
        size={ms(0)}
        amount={amount}
        format={6}
      />
      </Amount>
      <td />
   </DateContainer>
  )
}

TransactionsLabel.defaultProps = {
  date: 1530818702,
  amount: 1231226868,
}

export default TransactionsLabel