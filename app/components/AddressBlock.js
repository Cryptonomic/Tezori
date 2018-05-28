// @flow
import React, { Component } from 'react';
import DropdownArrow from 'material-ui/svg-icons/navigation/arrow-drop-down';
import DropupArrow from 'material-ui/svg-icons/navigation/arrow-drop-up';
import AddCircle from 'material-ui/svg-icons/content/add-circle';

import styles from './AddressBlock.css';

type Props = {}

export default class AddressBlock extends Component<Props> {
 props: Props;
 state = {
   isExpanded: false,
 };

  renderAccountBlock = ({ tzAmount, address }) => {
    return (
      <div className={styles.accountBlock}>
        <div className={styles.tzAmount}>
          {tzAmount}tz
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
    const accountBlocks = [
      {tzAmount: 4, address: '1023rka0d9f234'},
      {tzAmount: 2, address: '1230rkasdofi123'},
      {tzAmount: 3, address: 'zs203rtkasodifg'},
    ];

    return (
      <div className={styles.addressBlockContainer}>
        <div className={styles.addressBlockTitleContainer}>
          <div className={styles.addressBlockTitle}>
            tz1bn91adfi23409fs
            {this.renderArrowIcon()}
          </div>
          {this.state.isExpanded &&
            <div className={styles.tzAmount}>10.00t</div>
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
            {accountBlocks.map(this.renderAccountBlock)}
          </div>
        }
      </div>
    );
  }
}
