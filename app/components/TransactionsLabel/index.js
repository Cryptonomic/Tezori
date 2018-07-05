import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { ms } from '../../styles/helpers'
import TezosAmount from '../TezosAmount'

const TodayYesterdayFormat = {
  lastDay : '[Yesterday]',
  sameDay : '[Today]'
}

const timestampFormatter = timestamp => {
  const date = new Date(1000 * timestamp)
  const time =  moment(date).isBetween(moment().subtract(1, 'days'), moment())
    ? moment(date).calendar(null, TodayYesterdayFormat)
    : moment(date).format('MMMM DD')
    return time
}

const DateContainer = styled.div`
  background-color: ${ ({ theme: { colors } }) => colors.gray1 };
  border-bottom: 2px solid ${ ({ theme: { colors } }) => colors.gray6 };
  display: grid;
  grid-template-columns: 7fr 3fr;
  padding: ${ms(-4)} ${ms(4)}
`

const TransactionsDate = styled.span`
  color: ${ ({ theme: { colors } }) => colors.secondary };
  line-height: 1.63;
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.bold };
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
      <TezosAmount 
        color={'secondary'}
        size={ms(0)}
        amount={amount}
        format={2}
      />
   </DateContainer>
  )
}

TransactionsLabel.defaultProps = {
  date: 1530818702,
  amount: 1231226868,
}

export default TransactionsLabel