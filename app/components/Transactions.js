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

import tezosLogo from '../../resources/tezosLogo.png';
import styled from 'styled-components';
import { lighten } from 'polished';
import TezosAmount from './TezosAmount';
import { formatAmount } from '../utils/currancy';
import { ms } from '../styles/helpers';

const Container = styled.section`
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.white};
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
          <TableHeaderColumn>Amount</TableHeaderColumn>
          <TableHeaderColumn>Address</TableHeaderColumn>
          <TableHeaderColumn />
        </TableRow>
      </TableHeader>
    );
  }

  function renderTableRow(row, index) {
    const operationGroupHash = row.get('operationGroupHash');
    const rowArray = [
      row.get('amount'),
      operationGroupHash,
      operationGroupHash
    ];

    return (
      <TableRow key={index}>
        {rowArray.map((elem, rowArrIndex) => {
          return (
            <TableRowColumn key={`${elem}-${rowArrIndex}`}>
              {rowArrIndex + 1 < rowArray.length && (
                <RowElement>
                  {
                    rowArrIndex === 0
                      ? <Amount size={ms(0)} iconName="" amount={ formatAmount(elem) } />
                      : elem
                  }
                  {rowArrIndex === 0 && (
                    <TezosSymbol alt="tez" src={tezosLogo} />
                  )}
                </RowElement>
              )}
              {rowArrIndex + 1 === rowArray.length && (
                <Details>
                  <Link
                    href={`https://tzscan.io/${operationGroupHash}`}
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
