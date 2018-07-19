import React from 'react';
import styled, { css, withTheme } from 'styled-components';
import LeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import RightIcon from 'material-ui/svg-icons/navigation/chevron-right';

const Container = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 45px;
  user-select: none;
`;

const PageNavButtons = styled.div`
  background-color: #E3E7F1;
  cursor: pointer;
  height: 100%;
  
  &:hover {
    background-color: lightgray;
    transition: background-color 0.2s;
  }
`;

const LeftButton = styled(PageNavButtons)`
  padding: 10px 10px 10px 15px;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  margin-right: 3px;
`;

const RightButton = styled(PageNavButtons)`
  padding: 10px 15px 10px 10px;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  margin-left: 3px;
`;

const PageNumber = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 10px;
  cursor: pointer;
  ${({ activePage, theme: { colors } }) => {
    if ( activePage ) {
      return css`
        background-color: #E3E7F1;
        &:hover {
          background-color: lightgray;
          transition: background-color 0.2s;
        }
      `;
    }
    return css`
      background-color: lightgray;
      font-weight: 600;
    `;
  }};
`;

export default function PageNumbers({ currentPage, numberOfPages, onClick }) {
  function onPageClick(pageNum) {
    return () => {
      if (pageNum > 0 && pageNum <= numberOfPages) {
        onClick(pageNum);
      }
    };
  }

  function renderLeftButton() {
    return (
      <LeftButton
        onClick={onPageClick(currentPage - 1)}
      >
        <LeftIcon />
      </LeftButton>
    );
  }

  function renderRightButton() {
    return (
      <RightButton
        onClick={onPageClick(currentPage + 1)}
      >
        <RightIcon />
      </RightButton>
    );
  }

  function renderPageNumber(pageNum) {
    return (
      <PageNumber
        activePage={ pageNum !== currentPage }
        key={pageNum}
        onClick={onPageClick(pageNum)}
      >
        {pageNum}
      </PageNumber>
    );
  }

  const pageArray = Array(numberOfPages)
    .fill(0)
    .map((_, index) => index + 1);

  return (
    <Container>
      {renderLeftButton()}
      {pageArray.map(renderPageNumber)}
      {renderRightButton()}
    </Container>
  );
}
