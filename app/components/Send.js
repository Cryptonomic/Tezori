// @flow
import React, { Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';

import CreateButton from './CreateButton';

import styles from './Send.css';

type Props = {}

export default class Send extends Component<Props> {
  props: Props;
  state = {
    value: '0000',
  };

  onSelectChange = (event, index, value) => {
    this.setState({ value });
  };

  render() {
    return (
      <div className={styles.sendContainer}>
        <TextField
          floatingLabelText="Address"
          style={{ width: '100%' }}
        />
        <div className={styles.amountContainer}>
          <TextField
            floatingLabelText="Amount"
            style={{ width: '50%', marginRight: '50px' }}
          />
          <SelectField
            value={this.state.value}
            onChange={this.onSelectChange}
            style={{ width: '50%' }}
          >
            <MenuItem value="0000" primaryText="Low Fee: 0000"/>
            <MenuItem value="1000" primaryText="Medium Fee: 0000"/>
            <MenuItem value="2000" primaryText="High Fee: 0000"/>
            <MenuItem value="3000" primaryText="Custom"/>
          </SelectField>
        </div>
        <CreateButton
          label="Send"
          style={{
            border: '1px solid #7B91C0',
            color: '#7B91C0',
            height: '28px',
            fontSize: '15px',
            marginTop: '15px',
          }}
        />
      </div>
    );
  }
}
