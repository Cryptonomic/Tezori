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
import { formatAmount } from '../utils/currancy';
import { ms } from '../styles/helpers';

const Container = styled.section`
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.white};
  display: flex;
  justify-content: center;
`;

const Link = styled.span`
  display: flex;
  justify-content: flex-end;
  cursor: pointer;
  text-decoration: underline;
  text-decoration-color: ${({ theme: { colors } }) => colors.gray5};
  color: ${({ theme: { colors } }) => colors.gray7};
  padding: 0 10px 0 0;
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

const DateContainer = styled.div`
  background-color: ${({ theme: { colors } }) => colors.gray1 };
  border-bottom: 2px ${ ({ theme: { colors } }) => colors.gray6 };
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: ${ms(-4)} ${ms(-7)}
`

const Date = styled.span`
  color: ${({ theme: { colors } }) => colors.secondary };
  line-height: 1.63;
  font-weight: ${({ theme: { typo: { weights } } }) => weights.bold };
`

const TransactionContainer = styled.div`
  display: grid;
  flex-direction: row;
  grid-template-columns: 2fr 1fr 1fr;
  padding: ${ms(-4)} ${ms(-7)}
  border-bottom: 2px ${ ({ theme: { colors } }) => colors.gray6 };
`

const TransactionDate = styled.span`
  color: ${({ theme: { colors } }) => colors.gray5 };
`

const Fee = styled.div`
  font-size: ${ms(-2)};
  color: ${({ theme: { colors } }) => colors.gray5 };
`

const OutgoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`


const dateFormatter = timestamp => {
  const now = moment()
  const date = new Date(1000 * timestamp)
  return moment(date).isBetween(now.subtract(1, 'days'), now)
    ? moment(date).calendar()
    : moment(date).format('MMMM DD')
}

const openLink = element => shell.openExternal(`https://tzscan.io/${element}`)

const LabelRow = () => {
  const date = 1530403200
  return (
    <DateContainer>
      <Date>{dateFormatter(date)}</Date>
      <TezosAmount 
        color={'secondary'}
        size={ms(1)}
        amount={1231226868}
        format={2}
      />
   </DateContainer>
  )
}

const Outgo = props => {
  const { fee, amount } = props
  return ( 
    <OutgoContainer>
      <TezosAmount
        color={'red'}
        size={ms(1)}
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
        {renderTableHeader()}
        <TableBody displayRowCheckbox={false}>
          <LabelRow/>
          <TransactionContainer>
            <TezosAddress
              address={'tz1YttHzJvUU6BJqEh4HZKzB19j48uxUbjFc'}
              color={'gray7'}
              size={ms(1)}
            />
            <Outgo fee={10000345} amount={-12312312} />
            <Link onClick={() => {}}>
              Details
            </Link>
          </TransactionContainer>
          <TransactionContainer>
            <TezosAddress
              address={'tz1YttHzJvUU6BJqEh4HZKzB19j48uxUbjFc'}
              color={'gray7'}
              size={ms(1)}
            />
            <TezosAmount
              color={'green'}
              size={ms(1)}
              amount={1231226868}
              format={2}
            />
            <Link onClick={() => {}}>
              Details
            </Link>
          </TransactionContainer>
        </TableBody>
      </Table>
    </Container>
  );
}
