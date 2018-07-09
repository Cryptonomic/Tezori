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

import styled from 'styled-components';
import TezosAmount from './TezosAmount';
import { formatAmount } from '../utils/currancy';
import { ms } from '../styles/helpers';

const Container = styled.section`
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.white};
  display: flex;
  justify-content: center;
`;

const Details = styled.div`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  text-decoration: underline;
`;

const Link = styled.a`
  color: ${({ theme: { colors } }) => colors.gray0};
`;

const Amount = styled(TezosAmount)`
  color: inherit;
`;

const TezosSymbol = styled.img`
  height: 17px;
  width: 17px;
  filter: brightness(0%);
`;

const RowElement = styled.div`
  display: flex;
`;

type Props = {
  transactions: List
};

export default function Transactions(props: Props) {
  const { transactions } = props;

  function renderTableHeader() {
    return (
      <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
        <TableRow>
          <TableHeaderColumn>Block Level</TableHeaderColumn>
          <TableHeaderColumn>Kind</TableHeaderColumn>
          <TableHeaderColumn>Source</TableHeaderColumn>
          <TableHeaderColumn>Destination</TableHeaderColumn>
          <TableHeaderColumn>Amount</TableHeaderColumn>
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
    );
  }

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
                <Details>
                  <Link
                    href={`https://tzscan.io/${elem}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Details
                  </Link>
                </Details>
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
        {renderTableHeader()}
        <TableBody displayRowCheckbox={false}>
          {transactions.map(renderTableRow)}
        </TableBody>
      </Table>
    </Container>
  );
}
