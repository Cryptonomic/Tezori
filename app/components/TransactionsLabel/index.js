import React from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { ms } from '../../styles/helpers'
import TezosAmount from '../TezosAmount'

const TodayYesterdayFormat = {
  lastDay : '[Yesterday]',
  sameDay : '[Today]'
}

const timestampFormatter = date => {
  const time =  moment(date).isBetween(moment().subtract(2, 'days'), moment())
    ? moment(date).calendar(null, TodayYesterdayFormat)
    : moment(date).format('MMMM DD')
    return time
}

const DateContainer = styled.div`
  background-color: ${ ({ theme: { colors } }) => colors.gray1 };
  height: 42px;
  display: flex;
  padding: 0 25px;
  align-items: center;
  justify-content: space-between;  
`

const TransactionsDate = styled.div`
  color: ${ ({ theme: { colors } }) => colors.secondary };
  line-height: 1.63;
  font-weight: ${ ({ theme: { typo: { weights } } }) => weights.bold };
`

const Amount = styled.div`
  justify-self: end;
`

type Props = {
  date: string,
  amount: number
};

function TransactionsLabel(props: Props) {
  const { date, amount } = props
  return (
    <DateContainer>
      <TransactionsDate>{timestampFormatter(date)}</TransactionsDate>
      {/* <Amount>
        <TezosAmount 
          color='secondary'
          size={ms(0)}
          amount={amount}
          format={6}
        />
      </Amount> */}
    </DateContainer>
  )
}

TransactionsLabel.defaultProps = {
  amount: 1231226868,
}

export default TransactionsLabel