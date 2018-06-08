// @flow
import React from 'react';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui';

import tezosLogo from '../../resources/tezosLogo.png';
import styles from './Transactions.css';

type Props = {
  transactions: Object
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
      operationGroupHash,
    ];

    return (
      <TableRow key={index}>
        {
          rowArray.map((elem, rowArrIndex) => {
            return (
              <TableRowColumn key={`${elem}-${rowArrIndex}`}>
                { rowArrIndex + 1 < rowArray.length &&
                  <div className={styles.tableRowElement}>
                    {elem}
                    { rowArrIndex === 0 &&
                    <img
                      alt="tez"
                      src={tezosLogo}
                      className={styles.tezosSymbol}
                    />
                    }
                  </div>
                }
                {
                  rowArrIndex + 1 === rowArray.length &&
                    <div className={styles.details}>
                      <a
                        href={`https://tzscan.io/${operationGroupHash}`}
                        target="_blank"
                        rel="noopener"
                      >
                        Details
                      </a>
                    </div>
                }
              </TableRowColumn>
            );
          })
        }
      </TableRow>
    );
  }

  return (
    <div className={styles.transactionsContainer}>
      <Table>
        {renderTableHeader()}
        <TableBody displayRowCheckbox={false}>
          {transactions.map(renderTableRow)}
        </TableBody>
      </Table>
    </div>
  );
}
