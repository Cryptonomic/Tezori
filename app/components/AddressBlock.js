// @flow
import React, { Component } from 'react';
import classNames from 'classnames';
import DropdownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropupArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import tezosLogo from '../../resources/tezosLogo.png';
import styles from './AddressBlock.css';

type Props = {
  accountBlocks: Array<Object>
};

export default class AddressBlock extends Component<Props> {
 props: Props;
 state = {
   isExpanded: false,
 };

  renderAccountBlock = ({ tzAmount, address }) => {
    return (
      <div className={styles.accountBlock} key={`${address}-${tzAmount}`}>
        <div className={styles.tzAmount}>
          {tzAmount}
          <img
            src={tezosLogo}
            className={styles.tezosSymbol}
          />
        </div>
        <div>{address}</div>
      </div>
    );
  };

  renderArrowIcon = () => {
    if (!this.state.isExpanded) {
      return (
        <div
          className={styles.arrowContainer}
          onClick={() => this.setState({ isExpanded: true })}
        >
          <DropdownArrow />
        </div>
      );
    }

    return (
      <div
        className={styles.arrowContainer}
        onClick={() => this.setState({ isExpanded: false })}
      >
        <DropupArrow />
      </div>
    );
  };

  render() {
    const { isExpanded } = this.state;
    const addressBlockTitleContainer = classNames({
      [styles.addressBlockTitleContainer]: true,
      [styles.addressBlockTitleContainerExpanded]: isExpanded,
    });

    return (
      <div className={styles.addressBlockContainer}>
        <div className={addressBlockTitleContainer}>
          <div className={styles.addressBlockTitle}>
            tz1bn91adfi23409fs
            {this.renderArrowIcon()}
          </div>
          {this.state.isExpanded &&
            <div className={styles.tzAmount}>
              10.00
              <img
                src={tezosLogo}
                className={styles.tezosSymbolWhite}
              />
            </div>
          }
        </div>
        {this.state.isExpanded &&
          <div className={styles.accounts}>
            <div className={styles.addAccountBlock}>
              Accounts
              <AddCircle
                style={{
                  fill: '#7B91C0',
                  height: '18px',
                  width: '18px'
                }}
              />
            </div>
            {this.props.accountBlocks.map(this.renderAccountBlock)}
          </div>
        }
      </div>
    );
  }
}
