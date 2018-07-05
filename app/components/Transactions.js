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

export default function Transactions(props: Props) {
  const { transactions } = props;

  function renderTableRow(row, index) {
    const rowArray = [
      row.get('blockLevel'),
      row.get('kind'),
      row.get('source'),
      row.get('destination') || 'N/A',
      row.get('amount') || 'N/A',
      row.get('operationGroupHash'),
    ];

    return (
      <TableRow key={index}>
        {rowArray.map((elem, rowArrIndex) => {
          return (
            <TableRowColumn key={`${elem}-${rowArrIndex}`}>
              {rowArrIndex + 1 < rowArray.length && (
                <RowElement>
                  {
                    rowArrIndex === 4
                      ? <Amount size={ms(0)} amount={parseInt(elem)} />
                      : elem
                  }
                </RowElement>
              )}
              {rowArrIndex + 1 === rowArray.length && (
                <Link onClick={() => openLink(elem)}>
                  Details
                </Link>
              )}
            </TableRowColumn>
          );
        })}
      </TableRow>
    );
  }

  return (
    <Container>
      <Table>
        <TableBody displayRowCheckbox={false}>
          <TransactionsLabel amount={12345678} date={1530818702} />
          <Transaction amount={-12345678} fee={12345564} />
          <Transaction amount={12345678} />
          <TransactionsLabel amount={45612345678} date={1530403200} />
        </TableBody>
      </Table>
    </Container>
  );
}
