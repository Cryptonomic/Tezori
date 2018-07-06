// @flow
import React, { Fragment } from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui';
import moment from 'moment'
import { shell } from 'electron'

import tezosLogo from '../../resources/tezosLogo.png';
import styled from 'styled-components';
import TezosAmount from './TezosAmount';
import TezosAddress from './TezosAddress';
import TransactionsLabel from './TransactionsLabel';
import Transaction from './Transaction';
import { formatAmount } from '../utils/currancy';
import { ms } from '../styles/helpers';

const Container = styled.section`
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.white};
  display: flex;
  justify-content: center;
`;

const RowElement = styled.div`
  display: flex;
`;

type Props = {
  transactions: List
};

export default function Transactions(props:Props) {
  const { transactions } = props

  const ransactionsWithDate = transactions.map(transaction => {
    const date = moment(1000 * transaction.timestamp).format('l')
    return { ...transaction,
      date
    }
  })

  const transactionsByDate = ransactionsWithDate.reduce((acc, curr) => {
    acc[curr.date] = [].concat(acc[curr.date] || [], curr)
    return acc;
  }, {});

  const renderTransactions = () => {
    return Object.keys(transactionsByDate).map(day => renderDayTransactions(day, transactionsByDate[day]))
  }

  const renderDayTransactions = (day, transactions) => {
    return (
      <Fragment key={day}>
        <TransactionsLabel amount={0} date={moment(day).unix()} />
        {transactions.map(transaction => {
          const address = transaction.fee ? transaction.destination : transaction.source
          return (
            <Transaction
              key={transaction.operationId}
              amount={transaction.amount}
              date={transaction.timestamp}
              fee={transaction.fee}
              address={address}
            />
          )}
        )}
      </Fragment>
    )
  }

  return (
    <Container>
      <Table>
        <TableBody displayRowCheckbox={false}>
          {renderTransactions()}
        </TableBody>
      </Table>
    </Container>
  );
}
