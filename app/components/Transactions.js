// @flow
import React from 'react';
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
  const formatedTransactions = transactions.map(transaction => {
    const date = moment(transaction.timestamp).format('l')
    return { ...transaction,
      date
    }
  })

  // const newTransaction = formatedTransactions.reduce((result, transaction) => {
  //   if (result[transaction.date]) {
  //     result[transaction.date] = transaction;
  //   } else {
  //     result[transaction.date] = [
  //       ...result[transaction.date],
  //       transaction
  //     ]
  //   }
  //   return result
  // }, {})


  // const renderDayTransactions = () => formatedTransactions.map(transaction => {
  //   return <div>
  //     <TransactionsLabel amount={transaction.amount} date={transaction.timestamp} />
  //     <Transaction amount={transaction.amount} fee={transaction.fee} date={transaction.timestamp} address={destination} />
  //   </div>
  // })

  // const renderTableRow = (row, index) => {
  //   const rowArray = [
  //     row.get('blockLevel'),
  //     row.get('kind'),
  //     row.get('source'),
  //     row.get('destination') || 'N/A',
  //     row.get('amount') || 'N/A',
  //     row.get('operationGroupHash'),
  //   ];

  //   return (
  //     <TableRow key={index}>
  //       {rowArray.map((elem, rowArrIndex) => {
  //         return (
  //           <TableRowColumn key={`${elem}-${rowArrIndex}`}>
  //             {rowArrIndex + 1 < rowArray.length && (
  //               <RowElement>
  //                 {
  //                   rowArrIndex === 4
  //                     ? <Amount size={ms(0)} amount={parseInt(elem)} />
  //                     : elem
  //                 }
  //               </RowElement>
  //             )}
  //             {rowArrIndex + 1 === rowArray.length && (
  //               <Link onClick={() => openLink(elem)}>
  //                 Details
  //               </Link>
  //             )}
  //           </TableRowColumn>
  //         );
  //       })}
  //     </TableRow>
  //   );
  // }
  
  return (
    <Container>
      <Table>
        <TableBody displayRowCheckbox={false}>
          <TransactionsLabel amount={1234567+342145} date={1530880521} />
          <Transaction amount={1234567} date={1530880521}/>
          <Transaction amount={342145} fee={233} date={1530880521}/>
          <TransactionsLabel amount={3*876000} date={1530794121} />
          <Transaction amount={876000} fee={233} date={1530794121}/>
          <Transaction amount={876000} fee={123123} date={1530794121} />
          <Transaction amount={876000} date={1530794121} />
          <TransactionsLabel amount={129845} date={1530707721} />
          <Transaction amount={129845} date={1530711321}/>
        </TableBody>
      </Table>
    </Container>
  );
}
