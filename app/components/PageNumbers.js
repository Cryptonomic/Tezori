import React from 'react';
import classNames from 'classnames';
import LeftIcon from 'material-ui/svg-icons/navigation/chevron-left';
import RightIcon from 'material-ui/svg-icons/navigation/chevron-right';

import styles from './PageNumbers.css'

export default function PageNumbers({ currentPage, numberOfPages, onClick }) {
  function onPageClick(pageNum) {
    return () => {
      if (pageNum > 0 && pageNum <= numberOfPages) {
        onClick(pageNum);
      }
    }
  }

  function renderLeftButton() {
    return (
      <div
        className={styles.leftButton}
        onClick={onPageClick(currentPage - 1)}
      >
        <LeftIcon />
      </div>
    );
  }

  function renderRightButton() {
    return (
      <div
        className={styles.rightButton}
        onClick={onPageClick(currentPage + 1)}
      >
        <RightIcon />
      </div>
    );
  }

  function renderPageNumber(pageNum) {
    const pageNumberClass = classNames({
     [styles.nonActivePage]: pageNum !== currentPage,
     [styles.activePage]: pageNum === currentPage,
    });

    return (
      <div
        className={pageNumberClass}
        key={pageNum}
        onClick={onPageClick(pageNum)}
      >
        {pageNum}
      </div>
    )
  }

  const pageArray = Array(numberOfPages).fill(0).map((_, index) => index + 1);

  return (
    <div className={styles.pageNumbersContainer}>
      {renderLeftButton()}
      {pageArray.map(renderPageNumber)}
      {renderRightButton()}
    </div>
  );
}
