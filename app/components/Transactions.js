// @flow
import React from 'react';
import moment from 'moment';

import styled from 'styled-components';
import TransactionsLabel from './TransactionsLabel';
import Transaction from './Transaction';

const Container = styled.section`
  height: 100%;
  background-color: ${({ theme: { colors } }) => colors.white};
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const SectionContainer = styled.div``;

type Props = {
  transactions: List,
  selectedAccountHash: string,
  selectedParentHash: string
};

export default function Transactions(props: Props) {
  const { transactions, selectedAccountHash, selectedParentHash } = props;

  const ransactionsWithDate = transactions.map(transaction => {
    const date = moment(transaction.timestamp).format('l');
    return {
      ...transaction,
      date
    };
  });

  const transactionsByDate = ransactionsWithDate.reduce((acc, curr) => {
    acc[curr.date] = [].concat(acc[curr.date] || [], curr);
    return acc;
  }, {});

  const renderTransactions = () => {
    return Object.keys(transactionsByDate).map(day =>
      renderDayTransactions(day, transactionsByDate[day])
    );
  };

  const renderDayTransactions = (day, transactions) => (
    <SectionContainer key={day}>
      <TransactionsLabel amount={0} date={day} />
      {transactions.map(transaction => {
        return (
          <Transaction
            key={transaction.operationId}
            transaction={transaction}
            selectedAccountHash={selectedAccountHash}
            selectedParentHash={selectedParentHash}
          />
        );
      })}
    </SectionContainer>
  );

  return <Container>{renderTransactions()}</Container>;
}
